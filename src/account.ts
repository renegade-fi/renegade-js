import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import RenegadeError, { RenegadeErrorType } from "./errors";
import { Balance, Fee, Keychain, Order, Token, Wallet } from "./state";
import { BASEPOINT_ORDER } from "./state/keychain";
import {
  bigIntToLimbsLE,
  RENEGADE_AUTH_EXPIRATION_HEADER,
  RENEGADE_AUTH_HEADER,
} from "./state/utils";
import { AccountId, BalanceId, FeeId, OrderId, TaskId } from "./types";
import { RenegadeWs, TaskJob } from "./utils";

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
    ws?: RenegadeWs,
  ) {
    this._relayerHttpUrl = relayerHttpUrl;
    this._relayerWsUrl = relayerWsUrl;
    this._verbose = verbose || false;
    this._reset(keychain);
    this._isSynced = false;
    this._ws = ws;
  }

  /**
   * Reset the Wallet to its initial state by clearing its balances, orders, and
   * fees. Resets are useful in the case of desync from the relayer, allowing us
   * to re-query the relayer for the current wallet state.
   */
  private _reset(keychain?: Keychain): void {
    // Sample the randomness. Note that sampling in this manner slightly biases
    // the randomness; should not be a big issue since the bias is extremely
    // small.
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
      fees: [],
      keychain: keychain || this._wallet.keychain,
      blinder: blinder % BASEPOINT_ORDER,
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
      const messageBuffer = request.data
        ? Buffer.from(request.data.toString(), "ascii")
        : Buffer.alloc(0);
      const [renegadeAuth, renegadeAuthExpiration] =
        this._wallet.keychain.generateExpiringSignature(messageBuffer);
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
      const taskPromise = this._ws
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
      this._wallet = Wallet.deserialize(parsedMessage.wallet, true);
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
    const request: AxiosRequestConfig = {
      method: "GET",
      url: `${this._relayerHttpUrl}/v0/wallet/${this.accountId}`,
      validateStatus: () => true,
    };
    let response;
    try {
      response = await this._transmitHttpRequest(request, true);
    } catch (e) {
      return undefined;
    }
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
    let response;
    try {
      response = await this._transmitHttpRequest(request, false);
    } catch (e) {
      throw new RenegadeError(RenegadeErrorType.RelayerError);
    }
    if (response.status !== 200) {
      throw new RenegadeError(RenegadeErrorType.RelayerError, response.data);
    }
    return response.data.task_id;
  }

  /**
   * Deposit funds into the Account.
   *
   * TODO: This is a mock function, and does not actually transfer any ERC-20s at the moment.
   *
   * @param mint The Token to deposit.
   * @param amount The amount to deposit.
   */
  @assertSynced
  async deposit(mint: Token, amount: bigint) {
    const request: AxiosRequestConfig = {
      method: "POST",
      url: `${this._relayerHttpUrl}/v0/wallet/${this.accountId}/balances/deposit`,
      data: `{"public_var_sig":[],"from_addr":"0x0","mint":"${mint.serialize()}","amount":[${bigIntToLimbsLE(
        amount,
      ).join(",")}]}`,
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
   * Withdraw funds from an account.
   *
   * TODO: This is a mock function, and does not actually transfer any ERC-20s at the moment.
   *
   * @param mint The Token to withdraw.
   * @param amount The amount to withdraw.
   */
  @assertSynced
  async withdraw(mint: Token, amount: bigint) {
    const request: AxiosRequestConfig = {
      method: "POST",
      url: `${this._relayerHttpUrl}/v0/wallet/${
        this.accountId
      }/balances/${mint.serialize()}/withdraw`,
      data: `{"public_var_sig":[],"destination_addr":"0x0","amount":[${bigIntToLimbsLE(
        amount,
      ).join(",")}]}`,
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
    const request: AxiosRequestConfig = {
      method: "POST",
      url: `${this._relayerHttpUrl}/v0/wallet/${this.accountId}/orders`,
      data: `{"public_var_sig":[],"order":${order.serialize()}}`,
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
    const request: AxiosRequestConfig = {
      method: "POST",
      url: `${this._relayerHttpUrl}/v0/wallet/${this.accountId}/orders/${oldOrderId}`,
      data: `{"public_var_sig":[],"order":${newOrder.serialize()}}`,
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
    const request: AxiosRequestConfig = {
      method: "POST",
      url: `${this._relayerHttpUrl}/v0/wallet/${this.accountId}/orders/${orderId}/cancel`,
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
   * Getter for Fees.
   *
   * @throws {AccountNotSynced} If the Account has not yet been synced to the relayer.
   */
  @assertSynced
  get fees(): Record<FeeId, Fee> {
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

  /**
   * Getter for the underlying RenegadeWs.
   */
  get ws(): RenegadeWs {
    return this._ws;
  }
}
