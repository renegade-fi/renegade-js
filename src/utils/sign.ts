import { MAX_ORDERS } from "@/state/wallet";
import { generate_wallet_update_signature } from "../../renegade-utils";
import { Balance, Order, Token, Wallet } from "../state";
import { OrderId } from "../types";

const ERR_INSUFFICIENT_BALANCE = "insufficient balance";
const ERR_BALANCES_FULL = "balances full";
const ERR_ORDERS_FULL = "orders full";

/**
 * Sign the shares of a wallet.
 *
 * @param wallet The Wallet to sign the shares for.
 */
function signWalletShares(wallet: Wallet) {
  // Reblind the wallet, consuming the next set of blinders and secret shares
  const reblindedWallet = wallet.reblind();
  const serializedWallet = reblindedWallet.serialize();

  const statement_sig_hex = generate_wallet_update_signature(
    serializedWallet,
    reblindedWallet.keychain.keyHierarchy.root.secretKey
  );
  const statement_sig_bytes = new Uint8Array(
    Buffer.from(statement_sig_hex, "hex"),
  );
  const statement_sig = statement_sig_bytes.toString();
  return `[${statement_sig}]`;
}

/**
 * Add a balance to the wallet, replacing the first default balance
 */
function add_balance(wallet: Wallet, balance: Balance) {
  console.log("Adding balance to: ", wallet.balances)
  // const newBalances = wallet.balances.slice();
  const newBalances = wallet.balances
  console.log("Balances before deposit", newBalances)
  const mintAddress = balance.mint.address.replace("0x", "");
  const index = newBalances.findIndex(
    (balance) => balance.mint.address === mintAddress,
  );
  // If the balance exists, increment it
  if (index !== -1) {
    newBalances[index] = new Balance({
      mint: balance.mint,
      amount: newBalances[index].amount + balance.amount,
    });
    return newBalances;
  }

  // Otherwise add the balance
  if (newBalances.length < 5) {
    newBalances.push(balance);
    return newBalances;
  }

  // If the balances are full, try to find a balance to overwrite
  const idx = newBalances.findIndex(balance => balance.amount === 0n);
  if (idx !== -1) {
    newBalances[idx] = balance;
    return newBalances;
  } else {
    throw new Error(ERR_BALANCES_FULL);
  }
}

/**
 * Sign the shares of a wallet after performing a deposit.
 *
 * @param wallet The wallet to sign the shares for.
 * @param mint The Token to deposit.
 * @param amount The amount to deposit.
 */
export function signWalletDeposit(wallet: Wallet, mint: Token, amount: bigint) {
  try {
    const newBalances = add_balance(wallet, new Balance({ mint, amount }));
    const newWallet = new Wallet({
      ...wallet,
      balances: newBalances,
      exists: true,
    });
    return signWalletShares(newWallet);
  } catch (error) {
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
export function signWalletWithdraw(
  wallet: Wallet,
  mint: Token,
  amount: bigint,
) {
  // Find the balance to withdraw from
  const newBalances = [...wallet.balances];
  const mintAddress = mint.address.replace("0x", "");
  const index = newBalances.findIndex(
    (balance) => balance.mint.address === mintAddress,
  );
  if (index === -1) {
    throw new Error("No balance to withdraw");
  }

  // Apply the withdrawal to the wallet
  if (newBalances[index].amount >= amount) {
    newBalances[index] = new Balance({
      mint,
      amount: newBalances[index].amount - amount,
    });
  } else {
    throw new Error(ERR_INSUFFICIENT_BALANCE);
  }
  const newWallet = new Wallet({
    ...wallet,
    balances: newBalances,
    exists: true
  });
  return signWalletShares(newWallet);
}

/**
 * Add an order to the wallet, replacing the first default order if the wallet is full
 */
function addOrder(wallet: Wallet, order: Order) {
  // Append if the orders are not full
  const newOrders = [...wallet.orders];
  if (newOrders.length < MAX_ORDERS) {
    newOrders.push(order);
    return newOrders;
  }

  // Otherwise try to find an order to overwrite
  const idx = newOrders.findIndex(order => order.amount === 0n);
  if (idx !== -1) {
    newOrders[idx] = order;
    return newOrders;
  } else {
    throw new Error(ERR_ORDERS_FULL);
  }
}

/**
 * Sign wallet to place an order.
 *
 * @param wallet The wallet to sign the shares for.
 * @param order The order to place.
 *
 * Assumes this function is called after verifying wallet orderbook has space.
 */
export function signWalletPlaceOrder(wallet: Wallet, order: Order) {
  try {
    const newOrders = addOrder(wallet, order);
    const newWallet = new Wallet({
      ...wallet,
      orders: newOrders,
      exists: true
    });
    return signWalletShares(newWallet);
  } catch (error) {
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
export function signWalletModifyOrder(
  wallet: Wallet,
  oldOrderId: OrderId,
  newOrder: Order,
) {
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
export function signWalletCancelOrder(wallet: Wallet, orderId: OrderId) {
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
