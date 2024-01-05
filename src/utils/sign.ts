import { Balance, Order, Token, Wallet } from "../state";
import { bigIntToUint8Array } from "../state/utils";
import { OrderId } from "../types";

/**
 * Sign the shares of a wallet.
 *
 * @param wallet The Wallet to sign the shares for.
 */
function signWalletShares(wallet: Wallet) {
  // TODO: Reflect contract expectation for signature here
  const message = wallet.serialize();
  const walletSignatureHex =
    wallet.keychain.keyHierarchy.root.signMessage(message);
  const walletSignatureBytes = bigIntToUint8Array(
    BigInt("0x" + walletSignatureHex),
  );
  return `[${walletSignatureBytes}]`;
}

/**
 * Sign the shares of a wallet after performing a deposit.
 *
 * @param wallet The wallet to sign the shares for.
 * @param mint The Token to deposit.
 * @param amount The amount to deposit.
 */
export function signWalletDeposit(wallet: Wallet, mint: Token, amount: bigint) {
  console.log("🚀 ~ signWalletDeposit ~ mint:", mint);
  const mintAddress = mint.address.replace("0x", "");
  try {
    const newBalances = [...wallet.balances];
    console.log("Balances before deposit", wallet.balances);
    const index = newBalances.findIndex(
      (balance) => balance.mint.address === mintAddress,
    );
    if (index === -1) {
      newBalances.push(new Balance({ mint, amount }));
    } else {
      newBalances[index] = new Balance({
        mint,
        amount: newBalances[index].amount + amount,
      });
    }
    console.log("Balances after deposit", newBalances);
    const newWallet = new Wallet({
      ...wallet,
      balances: newBalances,
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
  console.log("🚀 ~ signWalletDeposit ~ mint:", mint);
  const mintAddress = mint.address.replace("0x", "");
  console.log("Balances before withdraw", wallet.balances);
  const newBalances = [...wallet.balances];
  console.log("Balances after withdraw", newBalances);
  const index = newBalances.findIndex(
    (balance) => balance.mint.address === mintAddress,
  );
  if (index === -1) {
    throw new Error("No balance to withdraw");
  }
  const newBalance = newBalances[index].amount - amount;
  if (newBalance < 0) {
    throw new Error("Insufficient balance to withdraw");
  } else if (newBalance === 0n) {
    newBalances.splice(index, 1);
  } else {
    newBalances[index] = new Balance({
      mint,
      amount: newBalance,
    });
  }
  const newWallet = new Wallet({
    ...wallet,
    balances: newBalances,
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
export function signWalletPlaceOrder(wallet: Wallet, order: Order) {
  try {
    const newOrders = [...wallet.orders].concat(order);
    const newWallet = new Wallet({
      ...wallet,
      orders: newOrders,
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
  });
  return signWalletShares(newWallet);
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
  return signWalletShares(newWallet);
}
