import { generate_external_transfer_signature, generate_wallet_update_signature, } from "../../renegade-utils";
import { Balance, Order, Wallet } from "../state";
import { MAX_BALANCES, MAX_ORDERS } from "../state/wallet";
const ERR_INSUFFICIENT_BALANCE = "insufficient balance";
const ERR_BALANCES_FULL = "balances full";
const ERR_ORDERS_FULL = "orders full";
/**
 * Sign the shares of a wallet.
 *
 * @param wallet The Wallet to sign the shares for.
 */
function signWalletShares(wallet) {
    // Reblind the wallet, consuming the next set of blinders and secret shares
    const reblindedWallet = wallet.reblind();
    const serializedWallet = reblindedWallet.serialize();
    console.log("Updated wallet", serializedWallet);
    const statement_sig_hex = generate_wallet_update_signature(serializedWallet, reblindedWallet.keychain.keyHierarchy.root.secretKey);
    const statement_sig_bytes = new Uint8Array(Buffer.from(statement_sig_hex, "hex"));
    const statement_sig = statement_sig_bytes.toString();
    return `[${statement_sig}]`;
}
/**
 * Add a balance to the wallet, replacing the first default balance
 */
function add_balance(wallet, balance) {
    // If the balance exists, increment it
    const newBalances = wallet.balances;
    const mintAddress = balance.mint.address.replace("0x", "");
    const index = newBalances.findIndex((balance) => balance.mint.address === mintAddress);
    if (index !== -1) {
        newBalances[index].amount += balance.amount;
        return newBalances;
    }
    const idx = find_first_replaceable_balance(wallet);
    if (idx !== -1) {
        const newBalances = [...wallet.balances];
        newBalances.splice(idx, 1, balance);
        return newBalances;
    }
    else if (wallet.balances.length < MAX_BALANCES) {
        const newBalances = [...wallet.balances];
        newBalances.push(balance);
        return newBalances;
    }
    else {
        throw new Error(ERR_BALANCES_FULL);
    }
}
// Find the index of the first default order in the wallet
function find_first_replaceable_balance(wallet) {
    return wallet.balances.findIndex((balance) => balance.amount === 0n &&
        balance.protocol_fee_balance === 0n &&
        balance.relayer_fee_balance === 0n);
}
/**
 * Sign the shares of a wallet after performing a deposit.
 *
 * @param wallet The wallet to sign the shares for.
 * @param mint The Token to deposit.
 * @param amount The amount to deposit.
 */
export function signWalletDeposit(wallet, mint, amount) {
    try {
        console.log("Balances before deposit: ", wallet.balances.map((balance) => new Balance({ ...balance, id: balance.balanceId })));
        const newBalances = add_balance(wallet, new Balance({
            mint,
            amount,
            relayer_fee_balance: 0n,
            protocol_fee_balance: 0n,
        }));
        console.log("Balances after deposit: ", newBalances);
        const newWallet = new Wallet({
            ...wallet,
            balances: newBalances,
            exists: true,
        });
        return signWalletShares(newWallet);
    }
    catch (error) {
        console.error("Error signing wallet update: ", error);
        throw error;
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
    console.log("Balances before withdraw: ", wallet.balances.map((balance) => new Balance({ ...balance, id: balance.balanceId })));
    // Find the balance to withdraw from
    const newBalances = [...wallet.balances];
    const mintAddress = mint.address.replace("0x", "");
    const index = newBalances.findIndex((balance) => balance.mint.address === mintAddress);
    if (index === -1) {
        throw new Error("No balance to withdraw");
    }
    // Withdraw an amount from the balance for the given mint
    if (newBalances[index].amount < amount) {
        throw new Error(ERR_INSUFFICIENT_BALANCE);
    }
    newBalances[index].amount -= amount;
    console.log("Balances after withdraw: ", newBalances.map((balance) => new Balance({ ...balance })));
    const newWallet = new Wallet({
        ...wallet,
        balances: newBalances,
        exists: true,
    });
    return signWalletShares(newWallet);
}
export function signWithdrawalTransfer(destinationAddr, mint, amount, skRoot) {
    const transfer = `{"account_addr":"${destinationAddr}","mint":"0x${mint.address}","amount":${amount},"direction":"Withdrawal"}`;
    const external_transfer_sig_hex = generate_external_transfer_signature(transfer, skRoot);
    const external_transfer_sig_bytes = new Uint8Array(Buffer.from(external_transfer_sig_hex, "hex"));
    return `[${external_transfer_sig_bytes.toString()}]`;
}
/**
 * Add an order to the wallet, replacing the first default order if the wallet is full
 */
function add_order(wallet, order) {
    // Append if the orders are not full
    const idx = find_first_replaceable_order(wallet);
    if (idx !== -1) {
        const newOrders = [...wallet.orders];
        newOrders.splice(idx, 1, order);
        return newOrders;
    }
    else if (wallet.orders.length < MAX_ORDERS) {
        const newOrders = [...wallet.orders];
        newOrders.push(order);
        return newOrders;
    }
    else {
        throw new Error(ERR_ORDERS_FULL);
    }
}
// Find the index of the first default order in the wallet
function find_first_replaceable_order(wallet) {
    return wallet.orders.findIndex((order) => order.amount === 0n);
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
        console.log("Orders before placing order: ", wallet.orders.map((order) => new Order({ ...order, id: order.orderId })));
        const newOrders = add_order(wallet, order);
        console.log("Orders after placing order: ", newOrders);
        const newWallet = new Wallet({
            ...wallet,
            orders: newOrders,
            exists: true,
        });
        return signWalletShares(newWallet);
    }
    catch (error) {
        console.error("Error signing wallet update: ", error);
        throw error;
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
    console.log("Orders before modifying order: ", wallet.orders.map((order) => new Order({ ...order, id: order.orderId })));
    const newOrders = [...wallet.orders];
    const idx = newOrders.findIndex((order) => order.orderId === oldOrderId);
    newOrders.splice(idx, 1, newOrder);
    console.log("Orders after modifying order: ", newOrders);
    const newWallet = new Wallet({
        ...wallet,
        orders: newOrders,
        exists: true,
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
    console.log("Orders before cancelling order: ", wallet.orders.map((order) => new Order({ ...order, id: order.orderId })));
    const newOrders = [...wallet.orders];
    const idx = newOrders.findIndex((order) => order.orderId === orderId);
    newOrders.splice(idx, 1);
    console.log("Orders after cancelling order: ", newOrders);
    const newWallet = new Wallet({
        ...wallet,
        orders: newOrders,
        exists: true,
    });
    return signWalletShares(newWallet);
}
