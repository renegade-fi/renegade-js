import { Order, Token, Wallet } from "../state";
import { OrderId } from "../types";
/**
 * Sign the shares of a wallet after performing a deposit.
 *
 * @param wallet The wallet to sign the shares for.
 * @param mint The Token to deposit.
 * @param amount The amount to deposit.
 */
export declare function signWalletDeposit(wallet: Wallet, mint: Token, amount: bigint): string;
/**
 * Sign a wallet withdrawal.
 *
 * @param wallet The wallet to sign the shares for.
 * @param mint The Token to withdraw.
 * @param amount The amount to withdraw.
 */
export declare function signWalletWithdraw(wallet: Wallet, mint: Token, amount: bigint): string;
export declare function signWithdrawalTransfer(destinationAddr: string, mint: Token, amount: bigint, skRoot: string): string;
/**
 * Sign wallet to place an order.
 *
 * @param wallet The wallet to sign the shares for.
 * @param order The order to place.
 *
 * Assumes this function is called after verifying wallet orderbook has space.
 */
export declare function signWalletPlaceOrder(wallet: Wallet, order: Order): string;
/**
 * Sign wallet to modify an order.
 *
 * @param wallet The wallet to sign the shares for.
 * @param oldOrderId The ID of the order to modify.
 * @param newOrder The new order to replace the old order.
 *
 */
export declare function signWalletModifyOrder(wallet: Wallet, oldOrderId: OrderId, newOrder: Order): string;
/**
 * Sign wallet to cancel an order.
 *
 * @param wallet The wallet to sign the shares for.
 * @param orderId The ID of the order to cancel.
 */
export declare function signWalletCancelOrder(wallet: Wallet, orderId: OrderId): string;
