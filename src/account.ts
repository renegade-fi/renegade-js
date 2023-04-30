import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import crypto from "crypto";

import RenegadeError, { RenegadeErrorType } from "./errors";
import { Balance, Fee, Keychain, Order, Wallet } from "./state";
import {
  RENEGADE_AUTH_EXPIRATION_HEADER,
  RENEGADE_AUTH_HEADER,
} from "./state/utils";
import {
  AccountId,
  BalanceId,
  CallbackId,
  FeeId,
  OrderId,
  TaskId,
} from "./types";
import { RenegadeWs, unimplemented } from "./utils";

// https://doc.dalek.rs/curve25519_dalek/constants/constant.BASEPOINT_ORDER.html
const BASEPOINT_ORDER =
  BigInt(2) ** BigInt(252) + BigInt("0x14def9dea2f79cd65812631a5cf5d3ed");

/**
 * A Renegade Account, which is a thin wrapper over the Wallet abstraction. The
 * authoritative Wallet state is stored on-chain in StarkNet encrypted Wallet
 * blobs, but we use local Wallet state for fast querying and to avoid
 * unnecessary on-chain calls.
 *
 * The Account class is responsible for managing the local Wallet state,
 * including streaming Wallet events in real-time from the relayer.
 */
export default class Account {
  // Fully-qualified URL of the relayer HTTP API.
  private _relayerHttpUrl: string;
  // Fully-qualified URL of the relayer WebSocket API.
  private _relayerWsUrl: string;
  // Print verbose output.
  private _verbose: boolean;
  // The WebSocket connection to the relayer.
  private _ws: RenegadeWs;
  // The current Wallet state.
  private _wallet: Wallet;
  // The callbackId used to stream Wallet updates from the relayer.
  private _walletCallbackId: CallbackId;
  // Has this Account been initialized?
  private _isInitialized: boolean;

  constructor(
    keychain: Keychain,
    relayerHttpUrl: string,
    relayerWsUrl: string,
    verbose?: boolean,
  ) {
    this._relayerHttpUrl = relayerHttpUrl;
    this._relayerWsUrl = relayerWsUrl;
    this._verbose = verbose || false;
    this._wallet = new Wallet({
      balances: [],
      orders: [],
      fees: [],
      keychain,
      randomness: this._generateRandomness(),
    });
    this._isInitialized = false;
  }

  /**
   * Generate blinding randomness, used to populate initial empty wallet state.
   *
   * @returns The generated randomness.
   */
  private _generateRandomness(): bigint {
    const sampleLimb = () => BigInt(crypto.randomInt(2 ** 32));
    const randomness =
      sampleLimb() +
      sampleLimb() * 2n ** 32n +
      sampleLimb() * 2n ** 64n +
      sampleLimb() * 2n ** 96n;
    // Note that sampling in this manner slightly biases the randomness; should
    // not be a big issue since the bias is extremely small.
    return randomness % BASEPOINT_ORDER;
  }

  // -------------
  // | Utilities |
  // -------------

  /**
   * Assert that the Account has been initialized, meaning that the Wallet is
   * now managed by the relayer and wallet update events are actively streaming
   * to the Account.
   *
   * @throws {AccountNotInitialized} If the Account has not yet been initialized.
   */
  private _assertInitialized(): void {
    if (!this._isInitialized) {
      throw new RenegadeError(RenegadeErrorType.AccountNotInitialized);
    }
  }

  /**
   * Transmit an HTTP request to the relayer. If the request is authenticated,
   * we will append two headers (renegade-auth and renegade-auth-expiration)
   * with expiring signatures of the body before transmission.
   *
   * @param request The request to transmit.
   * @param isAuthenticated If true, the request will be signed with an expiring signature.
   * @returns
   */
  private async _transmitHttpRequest(
    request: AxiosRequestConfig,
    isAuthenticated: boolean,
  ): Promise<AxiosResponse> {
    if (isAuthenticated) {
      const [renegadeAuth, renegadeAuthExpiration] =
        this._wallet.keychain.generateExpiringSignature(
          Buffer.from(request.data.toString(), "ascii"),
        );
      request.headers = request.headers || {};
      request.headers[RENEGADE_AUTH_HEADER] = JSON.stringify(renegadeAuth);
      request.headers[RENEGADE_AUTH_EXPIRATION_HEADER] = renegadeAuthExpiration;
    }
    return await axios.request(request);
  }

  /**
   * Tear down the Account, including closing the WebSocket connection to the
   * relayer.
   */
  teardown(): void {
    this._isInitialized = false;
    this._ws?.teardown();
  }

  // -----------------------
  // | Mutating Operations |
  // -----------------------

  /**
   * Initialize the Account. We first query the relayer to see if the underlying
   * Wallet is already managed; if so, simply assign the Wallet to the Account.
   *
   * If the Wallet is not managed by the relayer, we query the on-chain state to
   * recover the Wallet from the StarkNet contract.
   *
   * Otherwise, we create a brand new Wallet on-chain.
   *
   * @returns A TaskId representing the task of creating a new Wallet.
   */
  async startInitialization(): Promise<TaskId> {
    let wallet: Wallet | undefined;
    let taskId: TaskId;
    if ((wallet = await this._queryRelayerForWallet())) {
      // Query the relayer to see if this Account is already registered in relayer state.
      this._wallet = wallet;
      taskId = "DONE" as TaskId;
    } else if ((wallet = await this._queryChainForWallet())) {
      // Query the relayer to see if this Account is present in on-chain state.
      this._wallet = wallet;
      taskId = "DONE" as TaskId;
    } else {
      // The Wallet is not present in on-chain state, so we need to create it.
      taskId = await this._createNewWallet();
    }
    // Set up the WebSocket and start streaming events.
    await this._setupWebSocket();
    this._isInitialized = true; // TODO: We shouldn't actually set _isInitialized until the Wallet is created.
    return taskId;
  }

  /**
   * Set up the WebSocket connect to the relayer, and start streaming Wallet
   * update events.
   */
  private async _setupWebSocket() {
    this._ws = new RenegadeWs(this._relayerWsUrl, this._verbose);
    const callback = (message: string) => {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type !== "WalletUpdate") {
        return;
      }
      this._wallet = Wallet.deserialize(parsedMessage.wallet);
    };
    this._walletCallbackId = await this._ws.registerAccountCallback(
      callback,
      this.accountId,
      this._wallet.keychain,
    );
  }

  /**
   * Query the relayer to lookup the Wallet corresponding to this AccountId.
   * Note that this does not check the on-chain state; it simply checks if the
   * given AccountId is present in the relayer's local state.
   *
   * @returns The Wallet if it exists in the relayer's local state, or undefined
   * if it does not.
   */
  private async _queryRelayerForWallet(): Promise<Wallet | undefined> {
    const request: AxiosRequestConfig = {
      method: "GET",
      url: `${this._relayerHttpUrl}/v0/wallet/${this.accountId}`,
      data: "{}",
      validateStatus: () => true,
    };
    const response = await this._transmitHttpRequest(request, true);
    if (response.status === 200) {
      return Wallet.deserialize(response.data.wallet, true);
    } else {
      return undefined;
    }
  }

  /**
   * Query the on-chain state to lookup the Wallet corresponding to this
   * AccountId.
   *
   * @returns The Wallet if it exists in on-chain state, or undefined if it has
   * not yet been created.
   */
  private async _queryChainForWallet(): Promise<Wallet | undefined> {
    // TODO
    return undefined;
  }

  /**
   * Given the currently-populated Wallet values, create this Wallet on-chain
   * with a VALID WALLET CREATE proof.
   */
  private async _createNewWallet(): Promise<TaskId> {
    // TODO: Assert that Balances and Orders are empty.
    // Query the relayer to create a new Wallet.
    const request: AxiosRequestConfig = {
      method: "POST",
      url: `${this._relayerHttpUrl}/v0/wallet`,
      data: `{"wallet":${this._wallet.serialize(true)}}`,
      validateStatus: () => true,
    };
    const response = await this._transmitHttpRequest(request, false);
    if (response.status !== 200) {
      throw new Error("Failed to create new wallet.");
    }
    return response.data.task_id;
  }

  /**
   * Place a new order.
   *
   * @param order The new order to place.
   * @returns A TaskId that can be used to query the status of the order.
   *
   * @throws {AccountNotInitialized} If the Account has not yet been initialized.
   */
  async placeOrder(order: Order): Promise<TaskId> {
    this._assertInitialized();
    const request: AxiosRequestConfig = {
      method: "POST",
      url: `${this._relayerHttpUrl}/v0/wallet/${this.accountId}/orders`,
      data: `{"public_var_sig":[],"order":${order.serialize()}}`,
      validateStatus: () => true,
    };
    const response = await this._transmitHttpRequest(request, true);
    if (response.status !== 200) {
      throw new Error("Failed to create new order.");
    }
    return response.data.task_id;
  }

  // -----------
  // | Getters |
  // -----------

  /**
   * Getter for Balances.
   *
   * @throws {AccountNotInitialized} If the Account has not yet been initialized.
   */
  get balances(): Record<BalanceId, Balance> {
    this._assertInitialized();
    return this._wallet.balances.reduce((acc, balance) => {
      acc[balance.balanceId] = balance;
      return acc;
    }, {} as Record<BalanceId, Balance>);
  }

  /**
   * Getter for Orders.
   *
   * @throws {AccountNotInitialized} If the Account has not yet been initialized.
   */
  get orders(): Record<OrderId, Order> {
    this._assertInitialized();
    return this._wallet.orders.reduce((acc, order) => {
      acc[order.orderId] = order;
      return acc;
    }, {} as Record<OrderId, Order>);
  }

  /**
   * Getter for Fees.
   *
   * @throws {AccountNotInitialized} If the Account has not yet been initialized.
   */
  get fees(): Record<FeeId, Fee> {
    this._assertInitialized();
    return this._wallet.fees.reduce((acc, fee) => {
      acc[fee.feeId] = fee;
      return acc;
    }, {} as Record<FeeId, Fee>);
  }

  /**
   * Getter for the Keychain.
   */
  get keychain(): Keychain {
    return this._wallet.keychain;
  }

  /**
   * Getter for the AccountId.
   */
  get accountId(): AccountId {
    // Hack to force type conversion, as AccountId = WalletId.
    return this._wallet.walletId as string as AccountId;
  }
}
