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
} from "./types";
import { unimplemented } from "./utils";

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
  async ping() {
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

  // -----------------------------------
  // | IRenegadeAccount Implementation |
  // -----------------------------------

  async registerAccount(
    keychain: Keychain,
    skipInitialization?: boolean,
  ): Promise<AccountId> {
    if (skipInitialization === undefined) {
      skipInitialization = false;
    }
    const account = await new Account(
      keychain,
      this.relayerHttpUrl,
      this.relayerWsUrl,
    );
    const accountId = account.accountId;
    if (this._registeredAccounts[accountId]) {
      throw new RenegadeError(RenegadeErrorType.AccountAlreadyRegistered);
    }
    if (!skipInitialization) {
      await account.initialize();
    }
    this._registeredAccounts[accountId] = account;
    return accountId;
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

  // ---------------------------------------
  // | IRenegadeBalance Implementation |
  // ---------------------------------------

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
    const account = this._lookupAccount(accountId);
    await account.placeOrder(order);
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

  registerNetworkCallback(callbacK: (message: string) => void): CallbackId {
    unimplemented();
  }

  registerMpcCallback(callbacK: (message: string) => void): CallbackId {
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
}
