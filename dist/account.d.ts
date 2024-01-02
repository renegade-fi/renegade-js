import { Balance, Fee, Keychain, Order, Token } from "./state";
import { AccountId, BalanceId, FeeId, OrderId, TaskId } from "./types";
import { RenegadeWs, TaskJob } from "./utils";
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
    private _relayerHttpUrl;
    private _relayerWsUrl;
    private _verbose;
    private _ws;
    private _wallet;
    private _isSynced;
    constructor(keychain: Keychain, relayerHttpUrl: string, relayerWsUrl: string, verbose?: boolean);
    /**
     * Reset the Wallet to its initial state by clearing its balances, orders, and
     * fees. Resets are useful in the case of desync from the relayer, allowing us
     * to re-query the relayer for the current wallet state.
     */
    private _reset;
    /**
     * Transmit an HTTP request to the relayer. If the request is authenticated,
     * we will append two headers (renegade-auth and renegade-auth-expiration)
     * with expiring signatures of the body before transmission.
     *
     * @param request The request to transmit.
     * @param isAuthenticated If true, the request will be signed with an expiring signature.
     * @returns
     */
    private _transmitHttpRequest;
    /**
     * Tear down the Account, including closing the WebSocket connection to the
     * relayer.
     */
    teardown(): void;
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
    sync(): Promise<TaskJob<void>>;
    /**
     * Set up the WebSocket connect to the relayer, and start streaming Wallet
     * update events.
     */
    private _setupWebSocket;
    /**
     * Query the relayer to lookup the Wallet corresponding to this AccountId.
     * Note that this does not check the on-chain state; it simply checks if the
     * given AccountId is present in the relayer's local state.
     *
     * @returns The Wallet if it exists in the relayer's local state, or undefined
     * if it does not.
     */
    private _queryRelayerForWallet;
    /**
     * Manually fetch the latest Wallet state from the relayer. This is useful if
     * we want to force a refresh of the Wallet state.
     */
    queryWallet(): Promise<void>;
    /**
     * Query the on-chain state to lookup the Wallet corresponding to this
     * AccountId.
     *
     * @returns The Wallet if it exists in on-chain state, or undefined if it has
     * not yet been created.
     */
    private _queryChainForWallet;
    /**
     * Given the currently-populated Wallet values, create this Wallet on-chain
     * with a VALID WALLET CREATE proof.
     */
    private _createNewWallet;
    /**
     * Deposit funds into the Account.
     *
     * TODO: This is a mock function, and does not actually transfer any ERC-20s at the moment.
     *
     * @param mint The Token to deposit.
     * @param amount The amount to deposit.
     * @param fromAddr The on-chain address to transfer from.
     */
    deposit(mint: Token, amount: bigint, fromAddr: string): Promise<any>;
    /**
     * Withdraw funds from an account.
     *
     * TODO: This is a mock function, and does not actually transfer any ERC-20s at the moment.
     *
     * @param mint The Token to withdraw.
     * @param amount The amount to withdraw.
     */
    withdraw(mint: Token, amount: bigint): Promise<any>;
    /**
     * Place a new order.
     *
     * @param order The new order to place.
     * @returns A TaskId that can be used to query the status of the order.
     *
     * @throws {AccountNotSynced} If the Account has not yet been synced to the relayer.
     */
    placeOrder(order: Order): Promise<TaskId>;
    /**
     * Modify an outstanding order.
     *
     * @param oldOrderId The ID of the order to modify.
     * @param newOrder The new order to overwrite the old order.
     * @returns A TaskId that can be used to query the status of the order.
     *
     * @throws {AccountNotSynced} If the Account has not yet been synced to the relayer.
     */
    modifyOrder(oldOrderId: OrderId, newOrder: Order): Promise<TaskId>;
    /**
     * Modify or place an order.
     *
     * @param order The order to modify or place.
     * @returns A TaskId that can be used to query the status of the order.
     *
     * @throws {AccountNotSynced} If the Account has not yet been synced to the relayer.
     */
    modifyOrPlaceOrder(order: Order): Promise<TaskId>;
    /**
     * Cancel an outstanding order.
     *
     * @param orderId The ID of the order to cancel.
     * @returns A TaskId that can be used to query the status of the order.
     *
     * @throws {AccountNotSynced} If the Account has not yet been synced to the relayer.
     */
    cancelOrder(orderId: OrderId): Promise<TaskId>;
    /**
     * Getter for Balances.
     *
     * @throws {AccountNotSynced} If the Account has not yet been synced to the relayer.
     */
    get balances(): Record<BalanceId, Balance>;
    /**
     * Getter for Orders.
     *
     * @throws {AccountNotSynced} If the Account has not yet been synced to the relayer.
     */
    get orders(): Record<OrderId, Order>;
    /**
     * Getter for Fees.
     *
     * @throws {AccountNotSynced} If the Account has not yet been synced to the relayer.
     */
    get fees(): Record<FeeId, Fee>;
    /**
     * Getter for the Keychain.
     */
    get keychain(): Keychain;
    /**
     * Getter for the AccountId.
     */
    get accountId(): AccountId;
    /**
     * Getter for the underlying RenegadeWs.
     */
    get ws(): RenegadeWs;
    /**
     * Getter for the state of the update lock.
     */
    get isLocked(): boolean;
}
