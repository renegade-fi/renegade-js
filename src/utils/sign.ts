import { Balance, Order, Token, Wallet } from "../state";
import { OrderId } from "../types";

/**
 * Sign the shares of a wallet.
 *
 * @param wallet The Wallet to sign the shares for.
 */
function signWalletShares(wallet: Wallet) {
  const messageBuffer = Buffer.from(wallet.serialize(), "ascii");
  const walletSignatureBytes =
    wallet.keychain.keyHierarchy.root.signMessage(messageBuffer);
  return walletSignatureBytes;
}

/**
 * Sign the shares of a wallet after performing a deposit.
 *
 * @param wallet The wallet to sign the shares for.
 * @param mint The Token to deposit.
 * @param amount The amount to deposit.
 */
export function signWalletDeposit(wallet: Wallet, mint: Token, amount: bigint) {
  const newBalances = [...wallet.balances];
  const index = newBalances.findIndex((balance) => balance.mint === mint);
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
 * @param wallet The wallet to sign the shares for.
 * @param mint The Token to withdraw.
 * @param amount The amount to withdraw.
 */
export function signWalletWithdraw(
  wallet: Wallet,
  mint: Token,
  amount: bigint,
) {
  const newBalances = [...wallet.balances];
  const index = newBalances.findIndex((balance) => balance.mint === mint);
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
 * @param wallet The wallet to sign the shares for.
 * @param order The order to place.
 *
 * Assumes this function is called after verifying wallet orderbook has space.
 */
export function signWalletPlaceOrder(wallet: Wallet, order: Order) {
  const newOrders = [...wallet.orders].concat(order);
  const newWallet = new Wallet({
    ...wallet,
    orders: newOrders,
  });
  return this.signWalletShares(newWallet);
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
  });
  return this.signWalletShares(newWallet);
}

// TODO Verify this is same behavrior as relayer.
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
  });
  return this.signWalletShares(newWallet);
}
