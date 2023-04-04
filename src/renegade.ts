import Account from "./account";
import RenegadeError, { RenegadeErrorType } from "./errors";
import Keychain from "./keychain";
import { unimplemented } from "./utils";

type Uuid = number;
type AccountId = Uuid;
type CallbackId = Uuid;

enum Exchange {
  Median = 0,
  Binance,
  Coinbase,
  Kraken,
  Okx,
  Uniswapv3,
}

interface Token {}

// ----------------------
// | Account Management |
// ----------------------

/**
 * Interface for Account-related functions on the Renegade object.
 */
interface IRenegadeAccount {
  /**
   * Register a new account with the Renegade object.
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
 * Interface for one-off queries for the Renegade object.
 */
interface IRenegadePolling {}

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
  // The domain name of the relayer to connect to.
  relayerDomainName: string;
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
  // For each topic, contains a list of callbackIds to send messages to.
  private topicListeners: { [topic: string]: CallbackId[] };
  // Lookup from callbackId to actual callback function.
  private topicCallbacks: {
    [callbackId: CallbackId]: (message: string) => void;
  };
  // Fully-qualified URL of the relayer HTTP API.
  private relayerHttpUrl: string;
  // Fully-qualified URL of the relayer WebSocket API.
  private relayerWsUrl: string;

  /**
   * Construct a new Renegade object.
   *
   * @param config Configuration parameters for the Renegade object.
   *
   * @throws {InvalidDomainName} If the domain name is not a valid domain name.
   * @throws {InvalidPort} If the port is not a valid port.
   */
  constructor(config: RenegadeConfig) {
    this.topicListeners = {};
    this.topicCallbacks = {};
    // Set defaults, if not provided.
    config.relayerHttpPort = config.relayerHttpPort || 3000;
    config.relayerWsPort = config.relayerWsPort || 4000;
    config.useInsecureTransport = config.useInsecureTransport || false;
    // Construct the URLs and save them.
    this.relayerHttpUrl = this.constructUrl(
      "http",
      config.relayerDomainName,
      config.relayerHttpPort,
      config.useInsecureTransport,
    );
    this.relayerWsUrl = this.constructUrl(
      "http",
      config.relayerDomainName,
      config.relayerWsPort,
      config.useInsecureTransport,
    );
  }

  /**
   * Construct a URL from the given parameters.
   *
   * @param protocol Either "http" or "ws".
   * @param domainName The domain name of the URL to construct.
   * @param port The port of the URL to construct.
   * @param useInsecureTransport If true, use http:// or ws:// instead of https:// or wss://.
   * @returns The constructed URL.
   *
   * @throws {InvalidDomainName} If the domain name is not a valid domain name.
   * @throws {InvalidPort} If the port is not a valid port.
   */
  private constructUrl(
    protocol: "http" | "ws",
    domainName: string,
    port: number,
    useInsecureTransport: boolean,
  ): string {
    const domainRegex =
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domainName)) {
      throw new RenegadeError(RenegadeErrorType.InvalidDomainName);
    }
    if (port < 1 || port > 65535 || !Number.isInteger(port)) {
      throw new RenegadeError(RenegadeErrorType.InvalidPort);
    }
    return (
      protocol +
      (useInsecureTransport ? "" : "s") +
      "://" +
      domainName +
      ":" +
      port
    );
  }

  private expiringSignature(request: any, validUntil: number): number {
    unimplemented();
  }

  /*** IRenegadeAccount Implementation ***/

  async registerAccount(keychain: Keychain): Promise<AccountId> {
    // Creat a new Account and populate values from the relayer.
    // Create callbacks for this Account.
    unimplemented();
  }

  lookupAccount(accountId: AccountId): Account {
    unimplemented();
  }

  delegateAccount(accountId: AccountId, sendRoot?: boolean): void {
    unimplemented();
  }

  unregisterAccount(accountId: AccountId): void {
    // Remove all callbacks for this Account.
    unimplemented();
  }

  /*** IRenegadePolling Implementation ***/

  /*** IRenegadeStreaming Implementation ***/
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
