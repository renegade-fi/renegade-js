import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { z } from "zod";
import { bigint_to_limbs, sign_http_request } from "../renegade-utils";
import RenegadeError, { RenegadeErrorType } from "./errors";
import { Balance, Keychain, Order, Token, Wallet } from "./state";
import {
  RENEGADE_AUTH_EXPIRATION_HEADER,
  RENEGADE_AUTH_HEADER,
  bigIntToLimbsLE,
} from "./state/utils";
import { AccountId, BalanceId, OrderId, TaskId } from "./types";
import {
  CreateWalletRequest,
  CreateWalletResponse,
  TaskStatus,
  createPostRequest,
} from "./types/api";
import { RenegadeWs, TaskJob } from "./utils";
import { toFieldScalar } from "./utils/field";
import {
  signWalletCancelOrder,
  signWalletDeposit,
  signWalletModifyOrder,
  signWalletPlaceOrder,
  signWalletWithdraw,
  signWithdrawalTransfer,
} from "./utils/sign";

/**
 * A decorator that asserts that the Account has been synced, meaning that the
 * Wallet is now managed by the relayer and wallet update events are actively
 * streaming to the Account.
 *
 * @throws {AccountNotSynced} If the Account has not yet been synced to the relayer.
 */
function assertSynced(
  _target: object,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value || descriptor.get;
  const newMethod = function (...args: any[]) {
    if (!this._isSynced) {
      throw new RenegadeError(RenegadeErrorType.AccountNotSynced);
    }
    return originalMethod.apply(this, args);
  };
  if (descriptor.value) {
    descriptor.value = newMethod;
  } else if (descriptor.get) {
    descriptor.get = newMethod;
  }
}

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
  // Has this Account been synced to the relayer?
  private _isSynced: boolean;

  constructor(
    keychain: Keychain,
    relayerHttpUrl: string,
    relayerWsUrl: string,
    verbose?: boolean,
  ) {
    this._relayerHttpUrl = relayerHttpUrl;
    this._relayerWsUrl = relayerWsUrl;
    this._verbose = verbose || false;
    this._reset(keychain);
    this._isSynced = false;
  }

  /**
   * Reset the Wallet to its initial state by clearing its balances and orders.
   * Resets are useful in the case of desync from the relayer, allowing us
   * to re-query the relayer for the current wallet state.
   */
  private _reset(keychain?: Keychain): void {
    // Sample the randomness. Note that sampling in this manner slightly biases
    // the randomness; should not be a big issue since the bias is extremely
    // small.
    // TODO: Should reset derive blinder from Ethereum private key?
    const sampleLimb = () => BigInt(Math.floor(Math.random() * 2 ** 64));
    const blinder =
      sampleLimb() +
      sampleLimb() * 2n ** 64n +
      sampleLimb() * 2n ** 128n +
      sampleLimb() * 2n ** 192n;

    // Reset the Wallet.
    this._wallet = new Wallet({
      balances: [],
      orders: [],
      keychain: keychain || this._wallet.keychain,
      blinder: toFieldScalar(blinder),
    });

    // Reset the sync status.
    this._isSynced = false;
  }

  // -------------
  // | Utilities |
  // -------------

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
      const messageBuffer = request.data ?? "";
      const [renegadeAuth, renegadeAuthExpiration] =
        this.keychain.generateExpiringSignature(messageBuffer);

      // TODO: What does this line do
      request.headers = request.headers || {};
      request.headers[RENEGADE_AUTH_HEADER] = renegadeAuth;
      request.headers[RENEGADE_AUTH_EXPIRATION_HEADER] = renegadeAuthExpiration;
    }
    try {
      return await axios.request(request);
    } catch (error) {
      console.error("Error in _transmitHttpRequest", error);
    }
  }

  /**
   * Tear down the Account, including closing the WebSocket connection to the
   * relayer.
   */
  teardown(): void {
    this._reset();
    this._ws?.teardown();
  }

  // -----------------------
  // | Mutating Operations |
  // -----------------------

  /**
   * Sync the Account. We first query the relayer to see if the underlying
   * Wallet is already managed; if so, simply assign the Wallet to the Account.
   *
   * If the Wallet is not managed by the relayer, we query the on-chain state to
   * recover the Wallet from the StarkNet contract.
   *
   * Otherwise, we create a brand new Wallet on-chain.
   *
   * @returns A TaskId representing the task of creating a new Wallet, if applicable.
   */
  async sync(): Promise<TaskJob<void>> {
    let wallet: Wallet | undefined;
    let taskId: TaskId;
    if ((wallet = await this._queryRelayerForWallet())) {
      // Query the relayer to see if this Account is already registered in relayer state.
      this._wallet = wallet;
      await this._setupWebSocket();
      this._isSynced = true;
      return ["DONE" as TaskId, Promise.resolve()];
    } else if ((wallet = await this._queryChainForWallet())) {
      // Query the relayer to see if this Account is present in on-chain state.
      this._wallet = wallet;
      await this._setupWebSocket();
      this._isSynced = true;
      return ["DONE" as TaskId, Promise.resolve()];
    } else {
      // The Wallet is not present in on-chain state, so we need to create it.
      taskId = await this._createNewWallet();
      const taskPromise = new RenegadeWs(this._relayerWsUrl, this._verbose)
        .awaitTaskCompletion(taskId)
        .then(() => this._setupWebSocket())
        .then(() => {
          this._isSynced = true;
        });
      return [taskId, taskPromise];
    }
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
      const wallet = Wallet.deserialize(parsedMessage.wallet);
      if (!wallet) {
        console.error("Setting wallet to undefined");
      }
      this._wallet = wallet;
    };
    await this._ws.registerAccountCallback(
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
    const url = `${this._relayerHttpUrl}/v0/wallet/${this.accountId}`;

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    const [renegadeAuth, renegadeAuthExpiration] = sign_http_request(
      "",
      BigInt(Date.now()),
      this._wallet.keychain.keyHierarchy.root.secretKey,
    );
    headers.append(RENEGADE_AUTH_HEADER, renegadeAuth);
    headers.append(RENEGADE_AUTH_EXPIRATION_HEADER, renegadeAuthExpiration);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (response.status === 200) {
        const data = await response.json(); // Assuming the response is JSON
        return Wallet.deserialize(data.wallet);
      } else {
        return undefined;
      }
    } catch (e) {
      console.error("Error querying relayer for wallet: ", e);
      return undefined;
    }
  }

  /**
   * Manually fetch the latest Wallet state from the relayer. This is useful if
   * we want to force a refresh of the Wallet state.
   */
  async queryWallet(): Promise<void> {
    const wallet = await this._queryRelayerForWallet();
    // console.log("[SDK] Wallet: ", wallet);
    this._wallet = wallet;
  }

  /**
   * Query the on-chain state to lookup the Wallet corresponding to this
   * AccountId.
   *
   * @returns The Wallet if it exists in on-chain state, or undefined if it has
   * not yet been created.
   */
  private async _queryChainForWallet(): Promise<Wallet | undefined> {
    return undefined;
  }

  /**
   * Given the currently-populated Wallet values, create this Wallet on-chain
   * with a VALID WALLET CREATE proof.
   */
  @assertSynced
  async queryTaskQueue(): Promise<Array<z.infer<typeof TaskStatus>>> {
    const request: AxiosRequestConfig = {
      method: "GET",
      url: `${this._relayerHttpUrl}/v0/task_queue/${this.accountId}`,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const [renegadeAuth, renegadeAuthExpiration] = sign_http_request(
      "",
      BigInt(Date.now()),
      this._wallet.keychain.keyHierarchy.root.secretKey,
    );
    request.headers[RENEGADE_AUTH_HEADER] = renegadeAuth;
    request.headers[RENEGADE_AUTH_EXPIRATION_HEADER] = renegadeAuthExpiration;
    // const fetchWithZod = createZodFetcher(axios.request);
    // const response = await fetchWithZod(TaskQueueListResponse, request)
    const response = await axios.request(request);
    const parsedRes = response.data.tasks.map((task) => {
      return TaskStatus.parse({
        ...task,
        status: JSON.parse(task.status),
      });
    });
    return parsedRes;
  }

  /**
   * Given the currently-populated Wallet values, create this Wallet on-chain
   * with a VALID WALLET CREATE proof.
   */
  private async _createNewWallet(): Promise<TaskId> {
    // TODO: Assert that Balances and Orders are empty.
    const body: CreateWalletRequest = {
      wallet: this._wallet,
    };
    const response = createPostRequest(
      `${this._relayerHttpUrl}/v0/wallet`,
      body,
      CreateWalletResponse,
    );
    return await response.then((res) => res.data.task_id as TaskId);
  }

  /**
   * Deposit funds into the Account.
   *
   * @param mint The Token to deposit.
   * @param amount The amount to deposit.
   * @param fromAddr The on-chain address to transfer from.
   */
  @assertSynced
  async deposit(
    mint: Token,
    amount: bigint,
    fromAddr: string,
    permitNonce: bigint,
    permitDeadline: bigint,
    permitSignature: string,
  ) {
    // Fetch latest wallet from relayer
    // TODO: Temporary hacky fix, wallet should always be in sync with relayer
    const wallet = await this._queryRelayerForWallet();
    console.log("[SDK] Deposit: ", wallet);

    // Sign wallet deposit statement
    const statement_sig = signWalletDeposit(wallet, mint, amount);

    // Permit2 Fields
    const _permitNonce = bigint_to_limbs(permitNonce.toString(16));
    const _permitDeadline = bigint_to_limbs(permitDeadline.toString(16));
    const _permitSignatureBytes = new Uint8Array(
      Buffer.from(permitSignature.replace("0x", ""), "hex"),
    );

    const request: AxiosRequestConfig = {
      method: "POST",
      url: `${this._relayerHttpUrl}/v0/wallet/${this.accountId}/balances/deposit`,
      data: `{"public_var_sig":[],"from_addr":"${fromAddr}","mint":"${mint.serialize()}","amount":[${bigIntToLimbsLE(
        amount,
      ).join(
        ",",
      )}],"wallet_commitment_sig":${statement_sig},"permit_nonce":${_permitNonce},"permit_deadline":${_permitDeadline},"permit_signature":[${_permitSignatureBytes.join(
        ",",
      )}]}`,
      validateStatus: () => true,
    };
    let response;
    try {
      response = await this._transmitHttpRequest(request, true);
    } catch (e) {
      console.error("Error depositing", e);
      throw new RenegadeError(RenegadeErrorType.RelayerError);
    }
    if (response.status !== 200) {
      throw new RenegadeError(RenegadeErrorType.RelayerError, response.data);
    }
    return response.data.task_id;
  }

  /**
   * Withdraw funds from an account.
   *
   * @param mint The Token to withdraw.
   * @param amount The amount to withdraw.
   * @param destinationAddr The on-chain address to transfer to.
   */
  @assertSynced
  async withdraw(mint: Token, amount: bigint, destinationAddr: string) {
    // Fetch latest wallet from relayer
    // TODO: Temporary hacky fix, wallet should always be in sync with relayer
    const wallet = await this._queryRelayerForWallet();

    // Sign wallet withdrawal statement
    const statement_sig = signWalletWithdraw(wallet, mint, amount);
    const external_transfer_sig = signWithdrawalTransfer(
      destinationAddr,
      mint,
      amount,
      this._wallet.keychain.keyHierarchy.root.secretKey,
    );

    const request: AxiosRequestConfig = {
      method: "POST",
      url: `${this._relayerHttpUrl}/v0/wallet/${this.accountId
        }/balances/${mint.serialize()}/withdraw`,
      data: `{"public_var_sig":[],"destination_addr":"${destinationAddr}","amount":[${bigIntToLimbsLE(
        amount,
      ).join(
        ",",
      )}],"wallet_commitment_sig":${statement_sig},"external_transfer_sig":${external_transfer_sig}}`,
      validateStatus: () => true,
    };
    let response;
    try {
      response = await this._transmitHttpRequest(request, true);
    } catch (e) {
      throw new RenegadeError(RenegadeErrorType.RelayerError);
    }
    if (response.status !== 200) {
      throw new RenegadeError(RenegadeErrorType.RelayerError, response.data);
    }
    return response.data.task_id;
  }

  /**
   * Place a new order.
   *
   * @param order The new order to place.
   * @returns A TaskId that can be used to query the status of the order.
   *
   * @throws {AccountNotSynced} If the Account has not yet been synced to the relayer.
   */
  @assertSynced
  async placeOrder(order: Order): Promise<TaskId> {
    // Fetch latest wallet from relayer
    // TODO: Temporary hacky fix, wallet should always be in sync with relayer
    const wallet = await this._queryRelayerForWallet();

    // Sign wallet deposit statement
    const statement_sig = signWalletPlaceOrder(wallet, order);

    const request: AxiosRequestConfig = {
      method: "POST",
      url: `${this._relayerHttpUrl}/v0/wallet/${this.accountId}/orders`,
      data: `{"public_var_sig":[],"order":${order.serialize()},"statement_sig":${statement_sig}}`,
      validateStatus: () => true,
    };
    let response;
    try {
      response = await this._transmitHttpRequest(request, true);
    } catch (e) {
      console.error("Error placing order: ", e);
      throw new RenegadeError(RenegadeErrorType.RelayerError);
    }
    if (response.status !== 200) {
      throw new RenegadeError(RenegadeErrorType.RelayerError, response.data);
    }
    return response.data.task_id;
  }

  /**
   * Modify an outstanding order.
   *
   * @param oldOrderId The ID of the order to modify.
   * @param newOrder The new order to overwrite the old order.
   * @returns A TaskId that can be used to query the status of the order.
   *
   * @throws {AccountNotSynced} If the Account has not yet been synced to the relayer.
   */
  @assertSynced
  async modifyOrder(oldOrderId: OrderId, newOrder: Order): Promise<TaskId> {
    // Fetch latest wallet from relayer
    // TODO: Temporary hacky fix, wallet should always be in sync with relayer
    const wallet = await this._queryRelayerForWallet();

    // Sign wallet deposit statement
    const statement_sig = signWalletModifyOrder(wallet, oldOrderId, newOrder);
    const request: AxiosRequestConfig = {
      method: "POST",
      url: `${this._relayerHttpUrl}/v0/wallet/${this.accountId}/orders/${oldOrderId}/update`,
      data: `{"public_var_sig":[],"order":${newOrder.serialize()},"statement_sig":${statement_sig}}`,
      validateStatus: () => true,
    };
    let response;
    try {
      response = await this._transmitHttpRequest(request, true);
    } catch (e) {
      throw new RenegadeError(RenegadeErrorType.RelayerError);
    }
    if (response.status !== 200) {
      throw new RenegadeError(RenegadeErrorType.RelayerError, response.data);
    }
    return response.data.task_id;
  }

  /**
   * Cancel an outstanding order.
   *
   * @param orderId The ID of the order to cancel.
   * @returns A TaskId that can be used to query the status of the order.
   *
   * @throws {AccountNotSynced} If the Account has not yet been synced to the relayer.
   */
  @assertSynced
  async cancelOrder(orderId: OrderId): Promise<TaskId> {
    // Fetch latest wallet from relayer
    // TODO: Temporary hacky fix, wallet should always be in sync with relayer
    const wallet = await this._queryRelayerForWallet();

    // Sign wallet deposit statement
    const statement_sig = signWalletCancelOrder(wallet, orderId);
    const request: AxiosRequestConfig = {
      method: "POST",
      url: `${this._relayerHttpUrl}/v0/wallet/${this.accountId}/orders/${orderId}/cancel`,
      data: `{"statement_sig":${statement_sig}}`,
      validateStatus: () => true,
    };
    let response;
    try {
      response = await this._transmitHttpRequest(request, true);
    } catch (e) {
      throw new RenegadeError(RenegadeErrorType.RelayerError);
    }
    if (response.status !== 200) {
      throw new RenegadeError(RenegadeErrorType.RelayerError, response.data);
    }
    return response.data.task_id;
  }

  // -----------
  // | Getters |
  // -----------

  /**
   * Getter for Balances.
   *
   * @throws {AccountNotSynced} If the Account has not yet been synced to the relayer.
   */
  @assertSynced
  get balances(): Record<BalanceId, Balance> {
    return this._wallet.balances
      .filter((balance) => balance.amount !== BigInt(0))
      .reduce((acc, balance) => {
        acc[balance.balanceId] = balance;
        return acc;
      }, {} as Record<BalanceId, Balance>);
  }

  /**
   * Getter for Orders.
   *
   * @throws {AccountNotSynced} If the Account has not yet been synced to the relayer.
   */
  @assertSynced
  get orders(): Record<OrderId, Order> {
    return this._wallet.orders
      .filter((order) => order.amount !== BigInt(0))
      .reduce((acc, order) => {
        acc[order.orderId] = order;
        return acc;
      }, {} as Record<OrderId, Order>);
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

  /**
   * Getter for the underlying RenegadeWs.
   */
  get ws(): RenegadeWs {
    return this._ws;
  }
}
