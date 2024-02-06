import { generate_wallet_update_signature } from "renegade-utils";
import { Balance, Wallet } from "../state";
/**
 * Sign the shares of a wallet.
 *
 * @param wallet The Wallet to sign the shares for.
 */
function signWalletShares(wallet) {
    // Reblind the wallet, consuming the next set of blinders and secret shares
    const reblindedWallet = wallet.reblind();
    const serializedWallet = reblindedWallet.serialize();
    const statement_sig_hex = generate_wallet_update_signature(serializedWallet, reblindedWallet.keychain.keyHierarchy.root.secretKey);
    const statement_sig_bytes = new Uint8Array(Buffer.from(statement_sig_hex, "hex"));
    const statement_sig = statement_sig_bytes.toString();
    return `[${statement_sig}]`;
}
/**
 * Sign the shares of a wallet after performing a deposit.
 *
 * @param wallet The wallet to sign the shares for.
 * @param mint The Token to deposit.
 * @param amount The amount to deposit.
 */
export function signWalletDeposit(wallet, mint, amount) {
    const mintAddress = mint.address.replace("0x", "");
    try {
        const newBalances = [...wallet.balances];
        const index = newBalances.findIndex((balance) => balance.mint.address === mintAddress);
        if (index === -1) {
            newBalances.push(new Balance({ mint, amount }));
        }
        else {
            newBalances[index] = new Balance({
                mint,
                amount: newBalances[index].amount + amount,
            });
        }
        const newWallet = new Wallet({
            ...wallet,
            balances: newBalances,
            exists: true,
        });
        return signWalletShares(newWallet);
    }
    catch (error) {
        console.error("Error signing wallet update: ", error);
    }
}
/**
 * Sign a wallet withdrawal.
 *
 * @param wallet The wallet to sign the shares for.
 * @param mint The Token to withdraw.
 * @param amount The amount to withdraw.
 */
export function signWalletWithdraw(wallet, mint, amount) {
    const mintAddress = mint.address.replace("0x", "");
    const newBalances = [...wallet.balances];
    const index = newBalances.findIndex((balance) => balance.mint.address === mintAddress);
    if (index === -1) {
        throw new Error("No balance to withdraw");
    }
    const newBalance = newBalances[index].amount - amount;
    if (newBalance < 0) {
        throw new Error("Insufficient balance to withdraw");
    }
    else if (newBalance === 0n) {
        newBalances.splice(index, 1);
    }
    else {
        newBalances[index] = new Balance({
            mint,
            amount: newBalance,
        });
    }
    const newWallet = new Wallet({
        ...wallet,
        balances: newBalances,
        exists: true
    });
    return signWalletShares(newWallet);
}
/**
 * Sign wallet to place an order.
 *
 * @param wallet The wallet to sign the shares for.
 * @param order The order to place.
 *
 * Assumes this function is called after verifying wallet orderbook has space.
 */
export function signWalletPlaceOrder(wallet, order) {
    try {
        const newOrders = [...wallet.orders, order];
        const newWallet = new Wallet({
            ...wallet,
            orders: newOrders,
            exists: true
        });
        return signWalletShares(newWallet);
    }
    catch (error) {
        console.error("Error signing wallet update: ", error);
    }
}
/**
 * Sign wallet to modify an order.
 *
 * @param wallet The wallet to sign the shares for.
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
        exists: true
    });
    return signWalletShares(newWallet);
}
/**
 * Sign wallet to cancel an order.
 *
 * @param wallet The wallet to sign the shares for.
 * @param orderId The ID of the order to cancel.
 */
export function signWalletCancelOrder(wallet, orderId) {
    const newOrders = [...wallet.orders];
    const index = newOrders.findIndex((order) => order.orderId === orderId);
    newOrders.splice(index, 1);
    const newWallet = new Wallet({
        ...wallet,
        orders: newOrders,
        exists: true
    });
    return signWalletShares(newWallet);
}
