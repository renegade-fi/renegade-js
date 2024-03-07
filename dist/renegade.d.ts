import { IRenegadeAccount, IRenegadeBalance, IRenegadeFees, IRenegadeInformation, IRenegadeStreaming, IRenegadeTrading } from "./irenegade";
import { Balance, Fee, Keychain, Order, Token } from "./state";
import { AccountId, BalanceId, CallbackId, Exchange, FeeId, OrderId, TaskId } from "./types";
import { ExchangeHealthState } from "./types/schema";
import { Priority } from "./utils";
/**
 * Configuration parameters for initial Renegade object creation.
 */
export interface RenegadeConfig {
    relayerHostname: string;
    relayerHttpPort?: number;
    relayerWsPort?: number;
    useInsecureTransport?: boolean;
    verbose?: boolean;
    taskDelay?: number;
}
/**
 * The Renegade object is the primary method of interacting with the Renegade
 * relayer.
 */
export default class Renegade implements IRenegadeAccount, IRenegadeInformation, IRenegadeBalance, IRenegadeTrading, IRenegadeFees, IRenegadeStreaming {
    readonly relayerHttpUrl: string;
    readonly relayerWsUrl: string;
    private _verbose;
    private _taskDelay;
    private _ws;
    private _registeredAccounts;
    private _isTornDown;
    /**
     * Construct a new Renegade object.
     *
     * @param config Configuration parameters for the Renegade object.
     *
     * @throws {InvalidHostname} If the hostname is not a valid hostname.
     * @throws {InvalidPort} If the port is not a valid port.
     */
    constructor(config: RenegadeConfig);
    init(): Promise<void>;
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
    private _constructUrl;
    /**
     * Ping the relayer to check if it is reachable.
     */
    ping(): Promise<void>;
    queryExchangeHealthStates(baseToken: Token, quoteToken: Token): Promise<ExchangeHealthState>;
    queryOrders(): Promise<any>;
    queryWallet(accountId: AccountId): Promise<void>;
    queryTaskQueue(accountId: AccountId): Promise<{
        id?: string;
        status?: {
            task_type?: string;
            state?: string;
        };
        committed?: boolean;
    }[]>;
    /**
     * Get the semver of the relayer.
     */
    getVersion(): Promise<string>;
    private _lookupAccount;
    awaitTaskCompletion(taskId: TaskId): Promise<void>;
    teardown(): Promise<void>;
    registerAccount(keychain: Keychain): AccountId;
    initializeAccount(accountId: AccountId): Promise<void>;
    private _initializeAccountTaskJob;
    unregisterAccount(accountId: AccountId): Promise<void>;
    delegateAccount(accountId: AccountId, sendRoot?: boolean): Promise<void>;
    getBalances(accountId: AccountId): Record<BalanceId, Balance>;
    getOrders(accountId: AccountId): Record<OrderId, Order>;
    getFees(accountId: AccountId): Record<FeeId, Fee>;
    getKeychain(accountId: AccountId): Keychain;
    deposit(accountId: AccountId, mint: Token, amount: bigint, fromAddr: string, permitNonce: bigint, permitDeadline: bigint, permitSignature: string): Promise<void>;
    private _depositTaskJob;
    withdraw(accountId: AccountId, mint: Token, amount: bigint, destinationAddr: string): Promise<void>;
    private _withdrawTaskJob;
    placeOrder(accountId: AccountId, order: Order): Promise<void>;
    private _placeOrderTaskJob;
    modifyOrder(accountId: AccountId, oldOrderId: OrderId, newOrder: Order): Promise<void>;
    private _modifyOrderTaskJob;
    cancelOrder(accountId: AccountId, orderId: OrderId): Promise<void>;
    private _cancelOrderTaskJob;
    queryDesiredFee(): Promise<Fee>;
    approveFee(accountId: AccountId, fee: Fee): Promise<void>;
    modifyFee(accountId: AccountId, oldFeeId: FeeId, newFee: Fee): Promise<void>;
    revokeFee(accountId: AccountId, feeId: FeeId): Promise<void>;
    registerAccountCallback(callback: (message: string) => void, accountId: AccountId, priority?: Priority): Promise<CallbackId>;
    registerPriceReportCallback(callback: (message: string) => void, exchange: Exchange, baseToken: Token, quoteToken: Token, priority?: Priority): Promise<CallbackId>;
    registerTaskCallback(callback: (message: string) => void, taskId: TaskId, priority?: Priority): Promise<CallbackId>;
    registerOrderBookCallback(callback: (message: string) => void, priority?: Priority): Promise<CallbackId>;
    registerNetworkCallback(callback: (message: string) => void, priority?: Priority): Promise<CallbackId>;
    registerMpcCallback(callback: (message: string) => void, priority?: Priority): Promise<CallbackId>;
    releaseCallback(callbackId: CallbackId): Promise<void>;
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
    task: {
        initializeAccount: (accountId: AccountId) => Promise<[TaskId, Promise<void>]>;
        deposit: (accountId: AccountId, mint: Token, amount: bigint, fromAddr: string, permitNonce: bigint, permitDeadline: bigint, permitSignature: string) => Promise<[TaskId, Promise<void>]>;
        withdraw: (accountId: AccountId, mint: Token, amount: bigint, destinationAddr: string) => Promise<[TaskId, Promise<void>]>;
        placeOrder: (accountId: AccountId, order: Order) => Promise<[TaskId, Promise<void>]>;
        modifyOrder: (accountId: AccountId, oldOrderId: OrderId, newOrder: Order) => Promise<[TaskId, Promise<void>]>;
        cancelOrder: (accountId: AccountId, orderId: OrderId) => Promise<[TaskId, Promise<void>]>;
    };
}
