import { Balance, Wallet } from "../state";
/**
 * Sign the shares of a wallet.
 *
 * @param wallet The Wallet to sign the shares for.
 * @returns The signature of the wallet shares.
 */
function signWalletShares(wallet) {
    const messageBuffer = Buffer.from(wallet.serialize(), "ascii");
    const walletSignatureBytes = wallet.keychain.keyHierarchy.root.signMessage(messageBuffer);
    return walletSignatureBytes;
}
/**
 * Sign the shares of a wallet after performing a deposit.
 *
 * @param mint The Token to deposit.
 * @param amount The amount to deposit.
 * @param index The index of the balance to update.
 * @returns The signature of the wallet deposit.
 */
export function signWalletDeposit(wallet, mint, amount, index) {
    const newBalances = [...wallet.balances];
    const newBalance = newBalances[index].amount + amount;
    newBalances[index] = new Balance({
        mint,
        amount: newBalance,
    });
    const newWallet = new Wallet({
        ...wallet,
        balances: newBalances,
    });
    return signWalletShares(newWallet);
}
/**
 * Sign a wallet withdrawal.
 *
 * @param mint The Token to withdraw.
 * @param amount The amount to withdraw.
 * @param index The index of the balance to update.
 */
export function signWalletWithdraw(wallet, mint, amount, index) {
    const newBalances = [...wallet.balances];
    const newBalance = newBalances[index].amount - amount;
    newBalances[index] = new Balance({
        mint,
        amount: newBalance,
    });
    const newWallet = new Wallet({
        ...wallet,
        balances: newBalances,
    });
    return this.signWalletShares(newWallet);
}
/**
 * Sign wallet to place an order.
 *
 * @param order The order to place.
 *
 * Assumes this function is called after verifying wallet orderbook has space.
 */
export function signWalletPlaceOrder(wallet, order) {
    const newOrders = [...wallet.orders].concat(order);
    const newWallet = new Wallet({
        ...wallet,
        orders: newOrders,
    });
    return this.signWalletShares(newWallet);
}
/**
 * Modify a wallet order.
 *
 * @param oldOrderId The ID of the order to modify.
 * @param newOrder The new order to replace the old order.
 *
 */
export function signWalletModifyOrder(wallet, oldOrderId, newOrder) {
    const newOrders = [...wallet.orders];
    const index = newOrders.findIndex((order) => order.orderId === oldOrderId);
    newOrders[index] = newOrder;
    const newWallet = new Wallet({
        ...wallet,
        orders: newOrders,
    });
    return this.signWalletShares(newWallet);
}
