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
import { Priority } from "./utils";

// ----------------------
// | Account Management |
// ----------------------

/**
 * Interface for Account-related functions (registration, initialization,
 * relayer delegation, etc.).
 */
export interface IRenegadeAccount {
  /**
   * Register a new Account with the Renegade object.
   *
   * This simply creates a new Account from the Keychain and stores it in the
   * list of Renegade's managed accounts. The Acccount is not yet initialized,
   * and all read or write calls that affect the Account will fail until
   * Renegade::initializeAccount() is called.
   *
   * @param keychain The Keychain of the Account to register with the Renegade object.
   * @returns The AccountId of the newly registered Account.
   *
   * @throws {AccountAlreadyRegistered} If the Account corresponding to this Keychain is already registered with the Renegade object.
   */
  registerAccount(keychain: Keychain): AccountId;
  /**
   * Initialize an Account that has already been registered with the Renegade object.
   *
   * If this Account already exists in the network, the Account will be
   * populated with the current balances, orders, fees, etc.
   *
   * If the Account does not exist in the network, the Account will be
   * initialized with zeroes and sent to the relayer to create it on-chain.
   *
   * After the Account has been registered, we begin streaming all corresponding
   * account events from the relayer, so that the Account updates in real-time.
   */
  initializeAccount(accountId: AccountId): Promise<void>;
  /**
   * Unregister a previously-registered Account from the Renegade object, and
   * stop streaming updates.
   *
   * @param accountId The AccountId of the Account to unregister from the Renegade object.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  unregisterAccount(accountId: AccountId): Promise<void>;
  /**
   * Delegate an Account to the relayer for remote matching.
   *
   * @param accountId The AccountId of the Account to delegate to the relayer.
   * @param sendRoot If true, send sk_root to the relayer as "super-relayer mode".
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  delegateAccount(accountId: AccountId, sendRoot?: boolean): Promise<void>;
}

// -----------------------
// | Account Information |
// -----------------------

/**
 * Interface for viewing Account details.
 */
export interface IRenegadeInformation {
  /**
   * Get the current balances for an Account. Note that this is an immediate
   * snapshot; we do not await any pending tasks.
   *
   * @param accountId The AccountId of the Account to get balances for.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  getBalances(accountId: AccountId): Record<BalanceId, Balance>;
  /**
   * Get the current orders for an Account. Note that this is an immediate
   * snapshot; we do not await any pending tasks.
   *
   * @param accountId The AccountId of the Account to get orders for.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  getOrders(accountId: AccountId): Record<OrderId, Order>;
  /**
   * Get the current fees for an Account. Note that this is an immediate
   * snapshot; we do not await any pending tasks.
   *
   * @param accountId The AccountId of the Account to get fees for.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  getFees(accountId: AccountId): Record<FeeId, Fee>;
  /**
   * Get the Keychain of an Account.
   *
   * @param accountId The AccountId of the Account to get the keychain for.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  getKeychain(accountId: AccountId): Keychain;
}

// ---------------------
// | Balance Managment |
// ---------------------

/**
 * Interface for manipulation of Account balances (depositing, withdrawing).
 */
export interface IRenegadeBalance {
  /**
   * Deposit an asset into an Account, triggering a L1 inbox transaction.
   *
   * @param accountId The AccountId of the Account to deposit into.
   * @param mint The Token to deposit.
   * @param amount The amount of the Token to deposit.
   * @param fromAddr The on-chain address to transfer from.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  deposit(
    accountId: AccountId,
    mint: Token,
    amount: bigint,
    fromAddr: string,
    permitNonce: bigint,
    permitDeadline: bigint,
    permitSignature: string,
  ): Promise<void>;
  /**
   * Withdraw an asset from an Account, triggering a L1 outbox transaction.
   *
   * @param accountId The AccountId of the Account to withdraw from.
   * @param mint The Token to withdraw.
   * @param amount The amount of the Token to withdraw.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  withdraw(
    accountId: AccountId,
    mint: Token,
    amount: bigint,
    destinationAddr: string,
  ): Promise<void>;
}

// ---------------------
// | Trading Functions |
// ---------------------

/**
 * Interface for manipulation of Accounts (placing orders, depositing, etc.).
 */
export interface IRenegadeTrading {
  /**
   * Submit an order to the relayer.
   *
   * @param accountId The accountId of the Account to submit the order with.
   * @param order The new order to submit.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  placeOrder(accountId: AccountId, order: Order): Promise<void>;
  /**
   * Replace an order with a new order.
   *
   * @param accountId The accountId of the Account containing the order to replace.
   * @param oldOrderId The orderId of the order to replace.
   * @param newOrder The new order to submit.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  modifyOrder(
    accountId: AccountId,
    oldOrderId: OrderId,
    newOrder: Order,
  ): Promise<void>;
  /**
   * Cancel an order.
   *
   * @param accountId The accountId of the Account containing the order to cancel.
   * @param orderId The orderId of the order to cancel.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  cancelOrder(accountId: AccountId, orderId: OrderId): Promise<void>;
}

// ---------------------
// | Fee Configuration |
// ---------------------

/**
 * Interface for manipulation of fee approvals.
 */
export interface IRenegadeFees {
  /**
   * Query the relayer for its desired fee.
   */
  queryDesiredFee(): Promise<Fee>;
  /**
   * Approve a fee for an Account.
   *
   * @param accountId The AccountId of the Account for which to approve the fee.
   * @param fee The fee to approve.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  approveFee(accountId: AccountId, fee: Fee): Promise<void>;
  /**
   * Modify a fee for an Account.
   *
   * @param accountId The AccountId of the Account for which to modify the fee.
   * @param oldFeeId The id of the old fee to modify.
   * @param newFee The new fee to approve.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  modifyFee(accountId: AccountId, oldFeeId: FeeId, newFee: Fee): Promise<void>;
  /**
   * Revoke a fee for an Account.
   *
   * @param accountId The AccountId of the Account for which to revoke the fee.
   * @param feeId The id of the fee to revoke.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  revokeFee(accountId: AccountId, feeId: FeeId): Promise<void>;
}

// ---------------------
// | Websocket Streams |
// ---------------------

/**
 * Interface for all Websocket streaming data from the relayer.
 */
export interface IRenegadeStreaming {
  /**
   * Register a callback to be invoked when a new account event is received.
   *
   * @param callback The callback to invoke when a new account event is received.
   * @param accountId The AccountId of the Account to register the callback for.
   * @param priority The priority of the callback. Higher priority callbacks will be invoked before lower priority callbacks.
   *
   * @throws {AccountNotRegistered} If the Account corresponding to this AccountId is not registered with the Renegade object.
   */
  registerAccountCallback(
    callback: (message: string) => void,
    accountId: AccountId,
    priority?: Priority,
  ): Promise<CallbackId>;
  /**
   * Register a callback to be invoked when a new price report is received.
   *
   * @param callback The callback to invoke when a new price report is received.
   * @param exchange The Exchange to get price reports from.
   * @param baseToken The base Token to get price reports for.
   * @param quoteToken The quote Token to get price reports for.
   * @param priority The priority of the callback. Higher priority callbacks will be invoked before lower priority callbacks.
   */
  registerPriceReportCallback(
    callback: (message: string) => void,
    exchange: Exchange,
    baseToken: Token,
    quoteToken: Token,
    priority?: Priority,
  ): Promise<CallbackId>;
  /**
   * Register a callback to be invoked when a task state transition is received.
   *
   * @param callback The callback to invoke when a new order book update is received.
   * @param taskId The ID of the task to register the callback for.
   * @param priority The priority of the callback. Higher priority callbacks will be invoked before lower priority callbacks.
   */
  registerTaskCallback(
    callback: (message: string) => void,
    taskId: TaskId,
    priority?: Priority,
  ): Promise<CallbackId>;
  /**
   * Register a callback to be invoked when a new order book update is received.
   *
   * @param callback The callback to invoke when a new order book update is received.
   * @param priority The priority of the callback. Higher priority callbacks will be invoked before lower priority callbacks.
   */
  registerOrderBookCallback(
    callback: (message: string) => void,
    priority?: Priority,
  ): Promise<CallbackId>;
  /**
   * Register a callback to be invoked when a new network event is received.
   *
   * @param callback The callback to invoke when a new network event is received.
   * @param priority The priority of the callback. Higher priority callbacks will be invoked before lower priority callbacks.
   */
  registerNetworkCallback(
    callback: (message: string) => void,
    priority?: Priority,
  ): Promise<CallbackId>;
  /**
   * Register a callback to be invoked when a new MPC event is received.
   *
   * @param callback The callback to invoke when a new MPC event is received.
   * @param priority The priority of the callback. Higher priority callbacks will be invoked before lower priority callbacks.
   */
  registerMpcCallback(
    callback: (message: string) => void,
    priority?: Priority,
  ): Promise<CallbackId>;
  /**
   * Release a previously-registered callback. If no other callback is
   * registered for the same topic, the topic will be unsubscribed from.
   *
   * @param callbackId The CallbackId of the callback to release.
   *
   * @throws {CallbackNotRegistered} If the CallbackId is not registered with the Renegade object.
   */
  releaseCallback(callbackId: CallbackId): Promise<void>;
}
