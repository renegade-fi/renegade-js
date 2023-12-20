import { Order, Token, Wallet } from "../state";
import { OrderId } from "../types";
/**
 * Sign the shares of a wallet after performing a deposit.
 *
 * @param mint The Token to deposit.
 * @param amount The amount to deposit.
 * @param index The index of the balance to update.
 * @returns The signature of the wallet deposit.
 */
export declare function signWalletDeposit(wallet: Wallet, mint: Token, amount: bigint, index: number): Uint8Array;
/**
 * Sign a wallet withdrawal.
 *
 * @param mint The Token to withdraw.
 * @param amount The amount to withdraw.
 * @param index The index of the balance to update.
 */
export declare function signWalletWithdraw(wallet: Wallet, mint: Token, amount: bigint, index: number): any;
/**
 * Sign wallet to place an order.
 *
 * @param order The order to place.
 *
 * Assumes this function is called after verifying wallet orderbook has space.
 */
export declare function signWalletPlaceOrder(wallet: Wallet, order: Order): any;
/**
 * Modify a wallet order.
 *
 * @param oldOrderId The ID of the order to modify.
 * @param newOrder The new order to replace the old order.
 *
 */
export declare function signWalletModifyOrder(wallet: Wallet, oldOrderId: OrderId, newOrder: Order): any;
