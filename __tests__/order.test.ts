import { Keychain, Order, OrderId, Renegade, Token } from "../src";
import { renegadeConfig } from "./utils";

// Some test orders.
const order1 = new Order({
  baseToken: new Token({ ticker: "WETH" }),
  quoteToken: new Token({ ticker: "USDC" }),
  side: "buy",
  type: "limit",
  amount: BigInt(5),
  price: 2000,
});
const order2 = new Order({
  baseToken: new Token({ ticker: "WBTC" }),
  quoteToken: new Token({ ticker: "USDC" }),
  side: "sell",
  type: "limit",
  amount: BigInt(1),
  price: 30000,
});

// Equality check for orders, ignoring the timestamp.
function expectOrderEquality(order1: Order, order2: Order) {
  expect(order1.orderId).toEqual(order2.orderId);
  expect(order1.baseToken).toEqual(order2.baseToken);
  expect(order1.quoteToken).toEqual(order2.quoteToken);
  expect(order1.side).toEqual(order2.side);
  expect(order1.type).toEqual(order2.type);
  expect(order1.amount).toEqual(order2.amount);
  expect(order1.minimumAmount).toEqual(order2.minimumAmount);
  expect(order1.price).toEqual(order2.price);
}

// Equality check for a hashmap of orders, ignoring the timestamp.
function expectOrdersEquality(
  orders1: Record<OrderId, Order>,
  orders2: Record<OrderId, Order>,
) {
  expect(Object.keys(orders1).sort()).toEqual(Object.keys(orders2).sort());
  for (const orderId in orders1) {
    expectOrderEquality(orders1[orderId], orders2[orderId]);
  }
}

describe("Creating and Cancelling Orders", () => {
  test.concurrent(
    "Creating an order should result in the order being added to the Account's orders",
    async () => {
      // Setup the Account.
      const renegade = new Renegade(renegadeConfig);
      const accountId = renegade.registerAccount(new Keychain());
      await renegade.initializeAccount(accountId);

      // Create and submit the order.
      await renegade.placeOrder(accountId, order1);
      expectOrdersEquality(renegade.getOrders(accountId), {
        [order1.orderId]: order1,
      });

      // Teardown.
      await renegade.teardown();
    },
  );

  test.skip("Modifying an order should work", async () => {
    // Setup the Account.
    const renegade = new Renegade(renegadeConfig);
    const accountId = renegade.registerAccount(new Keychain());
    await renegade.initializeAccount(accountId);

    // Create and submit the order.
    await renegade.placeOrder(accountId, order1);
    expectOrdersEquality(renegade.getOrders(accountId), {
      [order1.orderId]: order1,
    });

    // Modify the order.
    await renegade.modifyOrder(accountId, order1.orderId, order2);
    expectOrdersEquality(renegade.getOrders(accountId), {
      [order2.orderId]: order2,
    });

    // Teardown.
    await renegade.teardown();
  });

  test.concurrent(
    "Creating and cancelling multiple orders should work",
    async () => {
      // Setup the Account.
      const renegade = new Renegade(renegadeConfig);
      const accountId = renegade.registerAccount(new Keychain());
      await renegade.initializeAccount(accountId);

      // Create and submit the orders.
      await renegade.placeOrder(accountId, order1);
      expectOrdersEquality(renegade.getOrders(accountId), {
        [order1.orderId]: order1,
      });
      await renegade.placeOrder(accountId, order2);
      expectOrdersEquality(renegade.getOrders(accountId), {
        [order1.orderId]: order1,
        [order2.orderId]: order2,
      });

      // Cancel one of the orders.
      await renegade.cancelOrder(accountId, order1.orderId);
      expectOrdersEquality(renegade.getOrders(accountId), {
        [order2.orderId]: order2,
      });

      // Teardown.
      await renegade.teardown();
    },
  );

  test.concurrent(
    "Concurrent account and order creation should work",
    async () => {
      // Get account IDs.
      const renegade = new Renegade(renegadeConfig);
      const accountId1 = renegade.registerAccount(new Keychain());
      const accountId2 = renegade.registerAccount(new Keychain());

      // Create and submit the orders.
      const promise1 = renegade
        .initializeAccount(accountId1)
        .then(() => renegade.placeOrder(accountId1, order1))
        .then(() => renegade.placeOrder(accountId1, order2))
        .then(() =>
          expectOrdersEquality(renegade.getOrders(accountId1), {
            [order1.orderId]: order1,
            [order2.orderId]: order2,
          }),
        );
      const promise2 = renegade
        .initializeAccount(accountId2)
        .then(() => renegade.placeOrder(accountId2, order1))
        .then(() => renegade.placeOrder(accountId2, order2))
        .then(() =>
          expectOrdersEquality(renegade.getOrders(accountId2), {
            [order1.orderId]: order1,
            [order2.orderId]: order2,
          }),
        );
      await Promise.all([promise1, promise2]);

      // Teardown.
      await renegade.teardown();
    },
  );
});
