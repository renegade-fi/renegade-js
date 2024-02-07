import axios, { AxiosRequestConfig } from "axios";

import Account from "./account";
import RenegadeError, { RenegadeErrorType } from "./errors";
import {
  IRenegadeAccount,
  IRenegadeBalance,
  IRenegadeFees,
  IRenegadeInformation,
  IRenegadeStreaming,
  IRenegadeTrading,
} from "./irenegade";
import { Balance, Fee, Keychain, Order, Token } from "./state";
import {
  AccountId,
  BalanceId,
  CallbackId,
  Exchange,
  FeeId,
  OrderId,
  TaskId,
} from "./types";
import {
  ExchangeHealthState,
  GetExchangeHealthStatesResponse,
  parseExchangeHealthStates,
} from "./types/schema";
import {
  Priority,
  RenegadeWs,
  TaskJob,
  createZodFetcher,
  unimplemented,
} from "./utils";

/**
 * A decorator that asserts that the relayer has not been torn down.
 *
 * @throws {RelayerTornDown} If the relayer has been torn down.
 */
function assertNotTornDown(
  _target: object,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    if (this._isTornDown) {
      throw new RenegadeError(RenegadeErrorType.RelayerTornDown);
    }
    return originalMethod.apply(this, args);
  };
}

/**
 * Configuration parameters for initial Renegade object creation.
 */
export interface RenegadeConfig {
  // The hostname of the relayer to connect to.
  relayerHostname: string;
  // The port of the relayer HTTP API.
  relayerHttpPort?: number;
  // The port of the relayer WebSocket API.
  relayerWsPort?: number;
  // Whether to use an insecure transport (HTTP/WS) for the relayer API. This is
  // helpful for local debugging, and should not be used in production systems.
  useInsecureTransport?: boolean;
  // Whether to print verbose output to the console.
  verbose?: boolean;
  // Number of milliseconds to sleep before returning from any task. Useful for
  // testing under load, when websocket messages may be buffered.
  taskDelay?: number;
}

/**
 * The Renegade object is the primary method of interacting with the Renegade
 * relayer.
 */
export default class Renegade
  implements
  IRenegadeAccount,
  IRenegadeInformation,
  IRenegadeBalance,
  IRenegadeTrading,
  IRenegadeFees,
  IRenegadeStreaming {
  // --------------------------
  // | State and Constructors |
  // --------------------------

  // Fully-qualified URL of the relayer HTTP API.
  public readonly relayerHttpUrl: string;
  // Fully-qualified URL of the relayer WebSocket API.
  public readonly relayerWsUrl: string;
  // Print verbose output.
  private _verbose: boolean;
  // Number of milliseconds to sleep before returning from any task.
  private _taskDelay: number;
  // The WebSocket connection to the relayer.
  private _ws: RenegadeWs;
  // All Accounts that have been registered with the Renegade object.
  private _registeredAccounts: Record<AccountId, Account>;
  // If true, the relayer has been torn down and is no longer usable.
  private _isTornDown: boolean;

  /**
   * Construct a new Renegade object.
   *
   * @param config Configuration parameters for the Renegade object.
   *
   * @throws {InvalidHostname} If the hostname is not a valid hostname.
   * @throws {InvalidPort} If the port is not a valid port.
   */
  constructor(config: RenegadeConfig) {
    // Set defaults, if not provided.
    config.relayerHttpPort =
      config.relayerHttpPort !== undefined ? config.relayerHttpPort : 3000;
    config.relayerWsPort =
      config.relayerWsPort !== undefined ? config.relayerWsPort : 4000;
    config.useInsecureTransport = config.useInsecureTransport || false;
    this._verbose = config.verbose || false;
    this._taskDelay = config.taskDelay || 0;
    // Construct the URLs and save them.
    if (config.relayerHostname === "localhost") {
      config.relayerHostname = "127.0.0.1";
    }
    this.relayerHttpUrl = this._constructUrl(
      "http",
      config.relayerHostname,
      config.relayerHttpPort,
      config.useInsecureTransport,
    );
    this.relayerWsUrl = this._constructUrl(
      "ws",
      config.relayerHostname,
      config.relayerWsPort,
      config.useInsecureTransport,
    );
    this._ws = new RenegadeWs(this.relayerWsUrl, this._verbose);
    this._registeredAccounts = {} as Record<AccountId, Account>;
    this._isTornDown = false;

    // Dynamically import renegade-utils WASM package if running in a browser
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      import("../renegade-utils").then(module => {
        const loadUtils = module.default;
        loadUtils();
      }).catch(error => {
        console.error("Failed to load utilities:", error);
      });
    }

  }

  /**
   * Construct a URL from the given parameters.
   *
   * @param protocol Either "http" or "ws".
   * @param hostname The hostname of the URL to construct.
   * @param port The port of the URL to construct.
   * @param useInsecureTransport If true, use http:// or ws:// instead of https:// or wss://.
   * @returns The constructed URL.
   *
   * @throws {InvalidHostname} If the hostname is not a valid hostname.
   * @throws {InvalidPort} If the port is not a valid port.
   */
  private _constructUrl(
    protocol: "http" | "ws",
    hostname: string,
    port: number,
    useInsecureTransport: boolean,
  ): string {
    const hostnameRegex =
      /^(?!:\/\/)((([a-zA-Z0-9-]{1,63}\.?)+[a-zA-Z]{2,63})|(?:\d{1,3}\.){3}\d{1,3})$/;
    if (!hostnameRegex.test(hostname)) {
      throw new RenegadeError(
        RenegadeErrorType.InvalidHostname,
        "Invalid hostname: " + hostname,
      );
    }
    if (port < 1 || port > 65535 || !Number.isInteger(port)) {
      throw new RenegadeError(
        RenegadeErrorType.InvalidPort,
        "Invalid port: " + port,
      );
    }
    return (
      protocol +
      (useInsecureTransport ? "" : "s") +
      "://" +
      hostname +
      ":" +
      port
    );
  }

  // -------------
  // | Utilities |
  // -------------

  /**
   * Ping the relayer to check if it is reachable.
   */
  @assertNotTornDown
  async ping(): Promise<void> {
    const request: AxiosRequestConfig = {
      method: "GET",
      url: `${this.relayerHttpUrl}/v0/ping`,
      validateStatus: () => true,
    };
    let response;
    try {
      response = await axios.request(request);
    } catch (e) {
      throw new RenegadeError(
        RenegadeErrorType.RelayerUnreachable,
        this.relayerHttpUrl,
      );
    }
    if (response.status !== 200 || !response.data.timestamp) {
      throw new RenegadeError(
        RenegadeErrorType.RelayerUnreachable,
        this.relayerHttpUrl,
      );
    }
  }

  @assertNotTornDown
  async queryExchangeHealthStates(
    baseToken: Token,
    quoteToken: Token,
  ): Promise<ExchangeHealthState> {
    const fetchWithZod = createZodFetcher(axios.request);
    const request: AxiosRequestConfig = {
      method: "POST",
      url: `${this.relayerHttpUrl}/v0/exchange/health_check`,
      data: `{"base_token": {"addr": "${baseToken.serialize()}"}, "quote_token": {"addr": "${quoteToken.serialize()}"}}`,
    };
    let response;
    try {
      await fetchWithZod(GetExchangeHealthStatesResponse, request).then(
        (res) => (response = res),
      );
    } catch (e) {
      throw new RenegadeError(RenegadeErrorType.RelayerError);
    }
    return parseExchangeHealthStates(response.data);
  }

  @assertNotTornDown
  async queryOrders() {
    const request: AxiosRequestConfig = {
      method: "GET",
      url: `${this.relayerHttpUrl}/v0/order_book/orders`,
      validateStatus: () => true,
    };
    let response;
    try {
      await axios.request(request).then((res) => (response = res.data));
    } catch (e) {
      throw new RenegadeError(RenegadeErrorType.RelayerError, String(e));
    }
    return response;
  }

  async queryWallet(accountId: AccountId): Promise<void> {
    const account = this._lookupAccount(accountId);
    return await account.queryWallet();
  }

  /**
   * Get the semver of the relayer.
   */
  @assertNotTornDown
  async getVersion(): Promise<string> {
    unimplemented();
  }

  private _lookupAccount(accountId: AccountId): Account {
    const account = this._registeredAccounts[accountId];
    if (!account) {
      throw new RenegadeError(
        RenegadeErrorType.AccountNotRegistered,
        "Account not registered: " + accountId,
      );
    }
    return account;
  }

  @assertNotTornDown
  async awaitTaskCompletion(taskId: TaskId): Promise<void> {
    await this._ws.awaitTaskCompletion(taskId);
    if (this._taskDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this._taskDelay));
    }
  }

  async teardown(): Promise<void> {
    for (const accountId in this._registeredAccounts) {
      await this.unregisterAccount(accountId as AccountId);
    }
    this._ws.teardown();
    this._isTornDown = true;
  }

  // -----------------------------------
  // | IRenegadeAccount Implementation |
  // -----------------------------------

  @assertNotTornDown
  registerAccount(keychain: Keychain): AccountId {
    const account = new Account(
      keychain,
      this.relayerHttpUrl,
      this.relayerWsUrl,
      this._verbose,
    );
    const accountId = account.accountId;
    if (this._registeredAccounts[accountId]) {
      throw new RenegadeError(RenegadeErrorType.AccountAlreadyRegistered);
    }
    this._registeredAccounts[accountId] = account;
    return accountId;
  }

  @assertNotTornDown
  async initializeAccount(accountId: AccountId): Promise<void> {
    const [, taskJob] = await this._initializeAccountTaskJob(accountId);
    return await taskJob;
  }

  private async _initializeAccountTaskJob(accountId: AccountId): TaskJob<void> {
    const account = this._lookupAccount(accountId);
    return await account.sync();
  }

  @assertNotTornDown
  async unregisterAccount(accountId: AccountId): Promise<void> {
    const account = this._lookupAccount(accountId);
    account.teardown();
    delete this._registeredAccounts[accountId];
  }

  @assertNotTornDown
  async delegateAccount(
    accountId: AccountId,
    sendRoot?: boolean,
  ): Promise<void> {
    unimplemented();
  }

  // ---------------------------------------
  // | IRenegadeInformation Implementation |
  // ---------------------------------------

  @assertNotTornDown
  getBalances(accountId: AccountId): Record<BalanceId, Balance> {
    const account = this._lookupAccount(accountId);
    return account.balances;
  }

  @assertNotTornDown
  getOrders(accountId: AccountId): Record<OrderId, Order> {
    const account = this._lookupAccount(accountId);
    return account.orders;
  }

  @assertNotTornDown
  getFees(accountId: AccountId): Record<FeeId, Fee> {
    const account = this._lookupAccount(accountId);
    return account.fees;
  }

  @assertNotTornDown
  getKeychain(accountId: AccountId): Keychain {
    const account = this._lookupAccount(accountId);
    return account.keychain;
  }

  @assertNotTornDown
  getIsLocked(accountId: AccountId): boolean {
    const account = this._lookupAccount(accountId);
    return account.isLocked;
  }

  // -----------------------------------
  // | IRenegadeBalance Implementation |
  // -----------------------------------

  @assertNotTornDown
  async deposit(
    accountId: AccountId,
    mint: Token,
    amount: bigint,
    fromAddr: string,
  ): Promise<void> {
    const [, taskJob] = await this._depositTaskJob(
      accountId,
      mint,
      amount,
      fromAddr,
    );
    return await taskJob;
  }

  private async _depositTaskJob(
    accountId: AccountId,
    mint: Token,
    amount: bigint,
    fromAddr: string,
  ): TaskJob<void> {
    const account = this._lookupAccount(accountId);
    const taskId = await account.deposit(mint, amount, fromAddr);
    return [taskId, this.awaitTaskCompletion(taskId)];
  }

  @assertNotTornDown
  async withdraw(
    accountId: AccountId,
    mint: Token,
    amount: bigint,
    destinationAddr: string,
  ): Promise<void> {
    const [, taskJob] = await this._withdrawTaskJob(
      accountId,
      mint,
      amount,
      destinationAddr,
    );
    return await taskJob;
  }

  private async _withdrawTaskJob(
    accountId: AccountId,
    mint: Token,
    amount: bigint,
    destinationAddr: string,
  ): TaskJob<void> {
    const account = this._lookupAccount(accountId);
    const taskId = await account.withdraw(mint, amount, destinationAddr);
    return [taskId, this.awaitTaskCompletion(taskId)];
  }

  // -----------------------------------
  // | IRenegadeTrading Implementation |
  // -----------------------------------

  @assertNotTornDown
  async placeOrder(accountId: AccountId, order: Order): Promise<void> {
    const [, taskJob] = await this._placeOrderTaskJob(accountId, order);
    return await taskJob;
  }

  private async _placeOrderTaskJob(
    accountId: AccountId,
    order: Order,
  ): TaskJob<void> {
    const account = this._lookupAccount(accountId);
    const taskId = await account.placeOrder(order);
    return [taskId, this.awaitTaskCompletion(taskId)];
  }

  @assertNotTornDown
  async modifyOrder(
    accountId: AccountId,
    oldOrderId: OrderId,
    newOrder: Order,
  ): Promise<void> {
    const [, taskJob] = await this._modifyOrderTaskJob(
      accountId,
      oldOrderId,
      newOrder,
    );
    return await taskJob;
  }

  private async _modifyOrderTaskJob(
    accountId: AccountId,
    oldOrderId: OrderId,
    newOrder: Order,
  ): TaskJob<void> {
    const account = this._lookupAccount(accountId);
    const taskId = await account.modifyOrder(oldOrderId, newOrder);
    return [taskId, this.awaitTaskCompletion(taskId)];
  }

  @assertNotTornDown
  async modifyOrPlaceOrder(
    accountId: AccountId,
    newOrder: Order,
  ): Promise<void> {
    const [, taskJob] = await this._modifyOrPlaceOrderTaskJob(
      accountId,
      newOrder,
    );
    return await taskJob;
  }

  private async _modifyOrPlaceOrderTaskJob(
    accountId: AccountId,
    newOrder: Order,
  ): TaskJob<void> {
    const account = this._lookupAccount(accountId);
    const taskId = await account.modifyOrPlaceOrder(newOrder);
    return [taskId, this.awaitTaskCompletion(taskId)];
  }

  @assertNotTornDown
  async cancelOrder(accountId: AccountId, orderId: OrderId): Promise<void> {
    const [, taskJob] = await this._cancelOrderTaskJob(accountId, orderId);
    return await taskJob;
  }

  private async _cancelOrderTaskJob(
    accountId: AccountId,
    orderId: OrderId,
  ): TaskJob<void> {
    const account = this._lookupAccount(accountId);
    const taskId = await account.cancelOrder(orderId);
    return [taskId, this.awaitTaskCompletion(taskId)];
  }

  // --------------------------------
  // | IRenegadeFees Implementation |
  // --------------------------------

  @assertNotTornDown
  async queryDesiredFee(): Promise<Fee> {
    unimplemented();
  }

  @assertNotTornDown
  async approveFee(accountId: AccountId, fee: Fee): Promise<void> {
    unimplemented();
  }

  @assertNotTornDown
  async modifyFee(
    accountId: AccountId,
    oldFeeId: FeeId,
    newFee: Fee,
  ): Promise<void> {
    unimplemented();
  }

  @assertNotTornDown
  async revokeFee(accountId: AccountId, feeId: FeeId): Promise<void> {
    unimplemented();
  }

  // -------------------------------------
  // | IRenegadeStreaming Implementation |
  // -------------------------------------

  @assertNotTornDown
  async registerAccountCallback(
    callback: (message: string) => void,
    accountId: AccountId,
    priority?: Priority,
  ): Promise<CallbackId> {
    // We could directly register a callback with
    // this._ws.registerAccountCallback(callback, ...), but this can lead to
    // race conditions.
    //
    // Since each individual Account streams account events to update its
    // internal balances, orders, and fees, directly registering an account
    // callback with the Renegade websocket does not guarantee ordering of these
    // messages.
    //
    // Instead, we hook directly into the Account stream.
    const account = this._lookupAccount(accountId);
    return await account.ws.registerAccountCallback(
      callback,
      accountId,
      account.keychain,
      priority,
    );
  }

  @assertNotTornDown
  async registerPriceReportCallback(
    callback: (message: string) => void,
    exchange: Exchange,
    baseToken: Token,
    quoteToken: Token,
    priority?: Priority,
  ): Promise<CallbackId> {
    return await this._ws.registerPriceReportCallback(
      callback,
      exchange,
      baseToken,
      quoteToken,
      priority,
    );
  }

  @assertNotTornDown
  async registerTaskCallback(
    callback: (message: string) => void,
    taskId: TaskId,
    priority?: Priority,
  ): Promise<CallbackId> {
    return await this._ws.registerTaskCallback(callback, taskId, priority);
  }

  @assertNotTornDown
  async registerOrderBookCallback(
    callback: (message: string) => void,
    priority?: Priority,
  ): Promise<CallbackId> {
    return await this._ws.registerOrderBookCallback(callback, priority);
  }

  @assertNotTornDown
  async registerNetworkCallback(
    callback: (message: string) => void,
    priority?: Priority,
  ): Promise<CallbackId> {
    return await this._ws.registerNetworkCallback(callback, priority);
  }

  @assertNotTornDown
  async registerMpcCallback(
    callback: (message: string) => void,
    priority?: Priority,
  ): Promise<CallbackId> {
    return await this._ws.registerMpcCallback(callback, priority);
  }

  @assertNotTornDown
  async releaseCallback(callbackId: CallbackId): Promise<void> {
    await this._ws.releaseCallback(callbackId);
  }

  // ---------------------------------
  // | Task-Based API Implementation |
  // ---------------------------------

  /**
   * The `task` object contains a subset of the Renegade API that contain
   * long-running tasks to be performed by the relayer. Instead of awaiting
   * entire task completion, these alternative implementations allow the caller
   * to directly receive the TaskId, and later await the task as appropriate.
   *
   * This is useful for user-focused integrations, where we want to expose
   * taskIds directly to the frontend, and allow the frontend to stream task
   * events.
   */
  task = {
    initializeAccount: async (
      ...args: Parameters<typeof this.initializeAccount>
    ) => await this._initializeAccountTaskJob(...args),
    deposit: async (...args: Parameters<typeof this._depositTaskJob>) =>
      await this._depositTaskJob(...args),
    withdraw: async (...args: Parameters<typeof this._withdrawTaskJob>) =>
      await this._withdrawTaskJob(...args),
    placeOrder: async (...args: Parameters<typeof this._placeOrderTaskJob>) =>
      await this._placeOrderTaskJob(...args),
    modifyOrder: async (...args: Parameters<typeof this._modifyOrderTaskJob>) =>
      await this._modifyOrderTaskJob(...args),
    modifyOrPlaceOrder: async (
      ...args: Parameters<typeof this._modifyOrPlaceOrderTaskJob>
    ) => await this._modifyOrPlaceOrderTaskJob(...args),
    cancelOrder: async (...args: Parameters<typeof this._cancelOrderTaskJob>) =>
      await this._cancelOrderTaskJob(...args),
    // approveFee: async (
    //   ...args: Parameters<typeof this._approveFeeTaskJob>
    // ) => await this._approveFeeTaskJob(...args),
    // modifyFee: async (
    //   ...args: Parameters<typeof this._modifyFeeTaskJob>
    // ) => await this._modifyFeeTaskJob(...args),
    // revokeFee: async (
    //   ...args: Parameters<typeof this._revokeFeeTaskJob>
    // ) => await this._revokeFeeTaskJob(...args),
  };
}
