import axios, { AxiosResponse } from "axios";

import Account from "./account";
import RenegadeError, { RenegadeErrorType } from "./errors";
import {
  IRenegadeAccount,
  IRenegadeBalance,
  IRenegadeFees,
  IRenegadeInformation,
  IRenegadeStreaming,
  IRenegadeTrading,
} from "./renegadeInterfaces";
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
import { RenegadeWs, unimplemented } from "./utils";

type TaskJob<R> = Promise<[TaskId, Promise<R>]>;

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
    IRenegadeStreaming
{
  // --------------------------
  // | State and Constructors |
  // --------------------------

  // Fully-qualified URL of the relayer HTTP API.
  public readonly relayerHttpUrl: string;
  // Fully-qualified URL of the relayer WebSocket API.
  public readonly relayerWsUrl: string;
  // Print verbose output.
  private _verbose: boolean;
  // The WebSocket connection to the relayer.
  private _ws: RenegadeWs;
  // All Accounts that have been registered with the Renegade object.
  private _registeredAccounts: { [accountId: AccountId]: Account };
  // For each topic, contains a list of callbackIds to send messages to.
  private _topicListeners: { [topic: string]: CallbackId[] };
  // Lookup from callbackId to actual callback function.
  private _topicCallbacks: {
    [callbackId: CallbackId]: (message: string) => void;
  };

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
    // Open a WebSocket connection to the relayer.
    this._ws = new RenegadeWs(this.relayerWsUrl);
    // Set empty accounts, topic listeners, and topic callbacks.
    this._registeredAccounts = {};
    this._topicListeners = {};
    this._topicCallbacks = {};
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
  async ping(): Promise<void> {
    let response: AxiosResponse;
    try {
      response = await axios.get(this.relayerHttpUrl + "/v0/ping", {
        data: {},
      });
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

  /**
   * Get the semver of the relayer.
   */
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

  async awaitTaskCompletion(taskId: TaskId): Promise<void> {
    if (taskId === "DONE") {
      return;
    }
    await this._ws.awaitTaskCompletion(taskId, this._verbose);
  }

  async teardown(): Promise<void> {
    await this._ws.teardown();
  }

  // -----------------------------------
  // | IRenegadeAccount Implementation |
  // -----------------------------------

  registerAccount(keychain: Keychain): AccountId {
    const account = new Account(
      keychain,
      this.relayerHttpUrl,
      this.relayerWsUrl,
    );
    const accountId = account.accountId;
    if (this._registeredAccounts[accountId]) {
      throw new RenegadeError(RenegadeErrorType.AccountAlreadyRegistered);
    }
    this._registeredAccounts[accountId] = account;
    return accountId;
  }

  async initializeAccount(accountId: string): Promise<void> {
    const [, taskJob] = await this._initializeAccountTaskJob(accountId);
    return await taskJob;
  }

  private async _initializeAccountTaskJob(accountId: AccountId): TaskJob<void> {
    const account = this._lookupAccount(accountId);
    const taskId = await account.startInitialization();
    return [taskId, this.awaitTaskCompletion(taskId)];
  }

  async unregisterAccount(accountId: AccountId): Promise<void> {
    const account = this._lookupAccount(accountId);
    await account.teardown();
    delete this._registeredAccounts[accountId];
  }

  async delegateAccount(
    accountId: AccountId,
    sendRoot?: boolean,
  ): Promise<void> {
    unimplemented();
  }

  // ---------------------------------------
  // | IRenegadeInformation Implementation |
  // ---------------------------------------

  getBalances(accountId: AccountId): { [balanceId: BalanceId]: Balance } {
    const account = this._lookupAccount(accountId);
    return account.balances;
  }

  getOrders(accountId: AccountId): { [orderId: OrderId]: Order } {
    const account = this._lookupAccount(accountId);
    return account.orders;
  }

  getFees(accountId: AccountId): { [feeId: FeeId]: Fee } {
    const account = this._lookupAccount(accountId);
    return account.fees;
  }

  // -----------------------------------
  // | IRenegadeBalance Implementation |
  // -----------------------------------

  async deposit(
    accountId: AccountId,
    mint: Token,
    amount: bigint,
  ): Promise<void> {
    unimplemented();
  }

  async withdraw(
    accountId: AccountId,
    mint: Token,
    amount: bigint,
  ): Promise<void> {
    unimplemented();
  }

  // -----------------------------------
  // | IRenegadeTrading Implementation |
  // -----------------------------------

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

  async modifyOrder(
    accountId: AccountId,
    oldOrderId: OrderId,
    newOrder: Order,
  ): Promise<void> {
    unimplemented();
  }

  async cancelOrder(accountId: AccountId, orderId: OrderId): Promise<void> {
    unimplemented();
  }

  // --------------------------------
  // | IRenegadeFees Implementation |
  // --------------------------------

  async queryDesiredFee(): Promise<Fee> {
    unimplemented();
  }

  async approveFee(accountId: AccountId, fee: Fee): Promise<void> {
    unimplemented();
  }

  async modifyFee(
    accountId: AccountId,
    oldFeeId: FeeId,
    newFee: Fee,
  ): Promise<void> {
    unimplemented();
  }

  async revokeFee(accountId: AccountId, feeId: FeeId): Promise<void> {
    unimplemented();
  }

  // -------------------------------------
  // | IRenegadeStreaming Implementation |
  // -------------------------------------

  registerPriceReportCallback(
    callback: (message: string) => void,
    exchange: Exchange,
    baseToken: Token,
    quoteToken: Token,
  ): CallbackId {
    unimplemented();
  }

  registerOrderBookCallback(callback: (message: string) => void): CallbackId {
    unimplemented();
  }

  registerNetworkCallback(callback: (message: string) => void): CallbackId {
    unimplemented();
  }

  registerMpcCallback(callback: (message: string) => void): CallbackId {
    unimplemented();
  }

  registerAccountCallback(
    callback: (message: string) => void,
    accountId?: AccountId,
  ): CallbackId {
    unimplemented();
  }

  releaseCallback(callbackId: CallbackId): void {
    unimplemented();
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
    ) => (await this._initializeAccountTaskJob(...args))[0],
    // deposit: (
    //   ...args: Parameters<typeof this._depositTaskJob>
    // ) => this._depositTaskJob(...args)[0],
    // withdraw: (
    //   ...args: Parameters<typeof this._withdrawTaskJob>
    // ) => this._withdrawTaskJob(...args)[0],
    // placeOrder: (
    //   ...args: Parameters<typeof this._placeOrderTaskJob>
    // ) => this._placeOrderTaskJob(...args)[0],
    // modifyOrder: (
    //   ...args: Parameters<typeof this._modifyOrderTaskJob>
    // ) => this._modifyOrderTaskJob(...args)[0],
    // cancelOrder: (
    //   ...args: Parameters<typeof this._cancelOrderTaskJob>
    // ) => this._cancelOrderTaskJob(...args)[0],
    // approveFee: (
    //   ...args: Parameters<typeof this._approveFeeTaskJob>
    // ) => this._approveFeeTaskJob(...args)[0],
    // modifyFee: (
    //   ...args: Parameters<typeof this._modifyFeeTaskJob>
    // ) => this._modifyFeeTaskJob(...args)[0],
    // revokeFee: (
    //   ...args: Parameters<typeof this._revokeFeeTaskJob>
    // ) => this._revokeFeeTaskJob(...args)[0],
  };
}
