import axios, { AxiosResponse } from "axios";

import Account from "./account";
import RenegadeError, { RenegadeErrorType } from "./errors";
import Keychain from "./keychain";
import { AccountId, CallbackId, Exchange, OrderId, Token } from "./types";
import { unimplemented } from "./utils";
import { Order } from "./wallet";

// ----------------------
// | Account Management |
// ----------------------

/**
 * Interface for Account-related functions (registration, relayer delegation,
 * etc.) on the Renegade object.
 */
interface IRenegadeAccount {
  /**
   * Register a new Account with the Renegade object.
   *
   * If the Account corresponding to this Keychain already exists in the
   * network, the Account will be populated with the current balances, orders,
   * fees, etc.
   *
   * If the Account corresponding to this Keychain does not exist in the
   * network, the Account will be initialized with zeroes and sent to the
   * relayer to create it on-chain.
   *
   * After the Account has been registered, we begin streaming all corresponding
   * account events from the relayer, so that the Account updates in real-time.
   *
   * @param keychain The Keychain of the Account to register with the Renegade object.
   * @returns The AccountId of the newly registered Account.
   *
   * @throws {AccountAlreadyRegistered} If the Account corresponding to this Keychain is already registered with the Renegade object.
   */
  registerAccount(keychain: Keychain): Promise<AccountId>;
  /**
   * Retreive an Account by its AccountId.
   *
   * @param accountId The AccountId of the Account  to look up.
   * @returns The Account corresponding to the given AccountId.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  lookupAccount(accountId: AccountId): Account;
  /**
   * Delegate an Account to the relayer for remote matching.
   *
   * @param accountId The AccountId of the Account to delegate to the relayer.
   * @param sendRoot If true, send sk_root to the relayer as "super-relayer mode".
   */
  delegateAccount(accountId: AccountId, sendRoot?: boolean): void;
  /**
   * Unregister a previously-registered Account from the Renegade object, and
   * stop streaming updates.
   *
   * @param accountId The AccountId of the Account to unregister from the Renegade object.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  unregisterAccount(accountId: AccountId): void;
}

// --------------------
// | Polling Requests |
// --------------------

/**
 * Interface for manipulation of Accounts (placing orders, depositing, etc.).
 */
interface IRenegadePolling {
  /**
   * Submit an order to the relayer.
   *
   * @param accountId The accountId of the Account to submit the order with.
   * @param order The new order to submit.
   */
  submitOrder(accountId: AccountId, order: Order): Promise<void>;
  /**
   * Replace an order with a new order.
   *
   * @param accountId The accountId of the Account containing the order to replace.
   * @param oldOrderId The orderId of the order to replace.
   * @param newOrder The new order to submit.
   */
  replaceOrder(
    accountId: AccountId,
    oldOrderId: OrderId,
    newOrder: Order,
  ): Promise<void>;
  /**
   * Cancel an order.
   *
   * @param accountId The accountId of the Account containing the order to cancel.
   * @param orderId
   */
  cancelOrder(accountId: AccountId, orderId: OrderId): Promise<void>;
}

// ---------------------
// | Websocket Streams |
// ---------------------

/**
 * Interface for all Websocket streaming data from the relayer.
 */
interface IRenegadeStreaming {
  /**
   * Register a callback to be invoked when a new price report is received.
   *
   * @param callback The callback to invoke when a new price report is received.
   * @param exchange The Exchange to get price reports from.
   * @param baseToken The base Token to get price reports for.
   * @param quoteToken The quote Token to get price reports for.
   */
  registerPriceReportCallback(
    callback: (message: string) => void,
    exchange: Exchange,
    baseToken: Token,
    quoteToken: Token,
  ): CallbackId;
  /**
   * Register a callback to be invoked when a new order book update is received.
   *
   * @param callback The callback to invoke when a new order book update is received.
   */
  registerOrderBookCallback(callback: (message: string) => void): CallbackId;
  /**
   * Register a callback to be invoked when a new network event is received.
   *
   * @param callback The callback to invoke when a new network event is received.
   */
  registerNetworkCallback(callback: (message: string) => void): CallbackId;
  /**
   * Register a callback to be invoked when a new MPC event is received.
   *
   * @param callback The callback to invoke when a new MPC event is received.
   */
  registerMpcCallback(callback: (message: string) => void): CallbackId;
  /**
   * Register a callback to be invoked when a new account event is received.
   *
   * @param callback The callback to invoke when a new account event is received.
   * @param accountId The AccountId of the Account to register the callback for.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  registerAccountCallback(
    callback: (message: string) => void,
    accountId: AccountId,
  ): CallbackId;
  /**
   * Release a previously-registered callback. If no other callback is
   * registered for the same topic, the topic will be unsubscribed from.
   *
   * @param callbackId The CallbackId of the callback to release.
   *
   * @throws {CallbackNotRegistered} If the CallbackId is not registered with the Renegade object.
   */
  releaseCallback(callbackId: CallbackId): void;
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
}

/**
 * The Renegade object is the primary method of interacting with the Renegade
 * relayer.
 */
export default class Renegade
  implements IRenegadeAccount, IRenegadePolling, IRenegadeStreaming
{
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

  lookupAccount(accountId: AccountId): Account {
    const account = this._registeredAccounts[accountId];
    if (!account) {
      throw new RenegadeError(
        RenegadeErrorType.AccountNotRegistered,
        "Account not registered: " + accountId,
      );
    }
    return account;
  }

  delegateAccount(accountId: AccountId, sendRoot?: boolean): void {
    unimplemented();
  }

  async unregisterAccount(accountId: AccountId): Promise<void> {
    const account = this.lookupAccount(accountId);
    await account.teardown();
    delete this._registeredAccounts[accountId];
  }

  // -----------------------------------
  // | IRenegadePolling Implementation |
  // -----------------------------------

  submitOrder(accountId: AccountId, order: Order): Promise<void> {
    unimplemented();
  }

  replaceOrder(
    accountId: AccountId,
    oldOrderId: OrderId,
    newOrder: Order,
  ): Promise<void> {
    unimplemented();
  }

  cancelOrder(accountId: AccountId, orderId: OrderId): Promise<void> {
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
