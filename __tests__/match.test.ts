import { AccountId, Keychain, Order, Renegade, Token } from "../src";
import { expectOrdersEquality, renegadeConfig } from "./utils";

async function setupMatchingAccounts(
  renegade: Renegade,
  orderBuy: Order,
  orderSell: Order,
  depositAmountBase: bigint,
  depositAmountQuote: bigint,
): Promise<[AccountId, AccountId]> {
  // Get account IDs.
  const accountIdBuy = renegade.registerAccount(new Keychain());
  const accountIdSell = renegade.registerAccount(new Keychain());

  // Create and submit the orders.
  const promiseBuy = renegade
    .initializeAccount(accountIdBuy)
    .then(() =>
      renegade.deposit(accountIdBuy, orderBuy.quoteToken, depositAmountQuote),
    )
    .then(() => renegade.placeOrder(accountIdBuy, orderBuy))
    .then(() =>
      expectOrdersEquality(renegade.getOrders(accountIdBuy), {
        [orderBuy.orderId]: orderBuy,
      }),
    );
  const promiseSell = renegade
    .initializeAccount(accountIdSell)
    .then(() =>
      renegade.deposit(accountIdSell, orderSell.baseToken, depositAmountBase),
    )
    .then(() => renegade.placeOrder(accountIdSell, orderSell))
    .then(() =>
      expectOrdersEquality(renegade.getOrders(accountIdSell), {
        [orderSell.orderId]: orderSell,
      }),
    );

  // Await until orders have been confirmed onchain.
  await Promise.all([promiseBuy, promiseSell]);
  return [accountIdBuy, accountIdSell];
}

async function blockUntilUpdate(
  renegade: Renegade,
  accountId: AccountId,
): Promise<void> {
  return new Promise((resolve) => {
    console.log("registering callback");
    renegade.registerAccountCallback(() => {
      console.log(`received update for ${accountId}`);
      resolve();
    }, accountId);
  });
}

describe("Internal Order Matching", () => {
  test.concurrent(
    "Two matching orders from different accounts should match",
    async () => {
      // Set up accounts.
      const renegade = new Renegade(renegadeConfig);
      const orderBuy = new Order({
        baseToken: new Token({ ticker: "WETH" }),
        quoteToken: new Token({ ticker: "USDC" }),
        side: "buy",
        type: "midpoint",
        amount: BigInt(5),
      });
      const orderSell = new Order({
        baseToken: new Token({ ticker: "WETH" }),
        quoteToken: new Token({ ticker: "USDC" }),
        side: "sell",
        type: "midpoint",
        amount: BigInt(2),
      });
      const amountBase = BigInt(50);
      const amountQuote = BigInt(1_000_000);
      const [accountIdBuy, accountIdSell] = await setupMatchingAccounts(
        renegade,
        orderBuy,
        orderSell,
        amountBase,
        amountQuote,
      );

      // Await until both wallets have an update.
      await Promise.all([
        blockUntilUpdate(renegade, accountIdBuy),
        blockUntilUpdate(renegade, accountIdSell),
      ]);

      // Assert that the orders were matched.
      const orderRemaining = new Order({
        id: orderBuy.orderId,
        baseToken: new Token({ ticker: "WETH" }),
        quoteToken: new Token({ ticker: "USDC" }),
        side: "buy",
        type: "midpoint",
        amount: BigInt(3),
      });
      expectOrdersEquality(renegade.getOrders(accountIdBuy), {
        [orderRemaining.orderId]: orderRemaining,
      });
      expectOrdersEquality(renegade.getOrders(accountIdSell), {});

      // Assert that the balances were updated.
      for (const balance of Object.values(renegade.getBalances(accountIdBuy))) {
        if (balance.mint.address === orderBuy.baseToken.address) {
          expect(balance.amount).toBe(
            orderBuy.amount < orderSell.amount
              ? orderBuy.amount
              : orderSell.amount,
          );
        } else if (balance.mint.address === orderBuy.quoteToken.address) {
          expect(balance.amount).toBeLessThan(amountQuote);
        }
      }
      for (const balance of Object.values(
        renegade.getBalances(accountIdSell),
      )) {
        if (balance.mint.address === orderSell.baseToken.address) {
          expect(balance.amount).toBe(
            amountBase -
              (orderBuy.amount < orderSell.amount
                ? orderBuy.amount
                : orderSell.amount),
          );
        } else if (balance.mint.address === orderSell.quoteToken.address) {
          expect(balance.amount).toBeGreaterThan(0);
        }
      }

      // Teardown.
      await renegade.teardown();
    },
  );

  // test.concurrent(
  //   "A second match should be possible after the first match",
  //   async () => {
  //     // Set up accounts.
  //     const renegade = new Renegade(renegadeConfig);
  //     const orderBuy = new Order({
  //       baseToken: new Token({ ticker: "WBTC" }),
  //       quoteToken: new Token({ ticker: "USDC" }),
  //       side: "buy",
  //       type: "midpoint",
  //       amount: BigInt(1),
  //     });
  //     const orderSell = new Order({
  //       baseToken: new Token({ ticker: "WBTC" }),
  //       quoteToken: new Token({ ticker: "USDC" }),
  //       side: "sell",
  //       type: "midpoint",
  //       amount: BigInt(5),
  //     });
  //     const amountBase = BigInt(50);
  //     const amountQuote = BigInt(1_000_000);
  //     const [accountIdBuy, accountIdSell] = await setupMatchingAccounts(
  //       renegade,
  //       orderBuy,
  //       orderSell,
  //       amountBase,
  //       amountQuote,
  //     );

  //     // Await until both wallets have an update.
  //     await Promise.all([
  //       blockUntilUpdate(renegade, accountIdBuy),
  //       blockUntilUpdate(renegade, accountIdSell),
  //     ]);

  //     // Assert that the first pair of orders were matched.
  //     const orderRemaining1 = new Order({
  //       id: orderSell.orderId,
  //       baseToken: new Token({ ticker: "WBTC" }),
  //       quoteToken: new Token({ ticker: "USDC" }),
  //       side: "sell",
  //       type: "midpoint",
  //       amount: BigInt(4),
  //     });
  //     expectOrdersEquality(renegade.getOrders(accountIdBuy), {});
  //     expectOrdersEquality(renegade.getOrders(accountIdSell), {
  //       [orderRemaining1.orderId]: orderRemaining1,
  //     });

  //     // Place the second buy order.
  //     await renegade.placeOrder(accountIdBuy, orderBuy);

  //     // Await until both wallets have an update.
  //     await Promise.all([
  //       blockUntilUpdate(renegade, accountIdBuy),
  //       blockUntilUpdate(renegade, accountIdSell),
  //     ]);

  //     // Assert that the second pair of orders were matched.
  //     const orderRemaining2 = new Order({
  //       id: orderSell.orderId,
  //       baseToken: new Token({ ticker: "WBTC" }),
  //       quoteToken: new Token({ ticker: "USDC" }),
  //       side: "sell",
  //       type: "midpoint",
  //       amount: BigInt(3),
  //     });
  //     expectOrdersEquality(renegade.getOrders(accountIdBuy), {});
  //     expectOrdersEquality(renegade.getOrders(accountIdSell), {
  //       [orderRemaining2.orderId]: orderRemaining2,
  //     });

  //     // Teardown.
  //     await renegade.teardown();
  //   },
  // );
});
