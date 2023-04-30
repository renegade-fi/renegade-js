import { Order, Renegade, Token } from "../src";
import { globalKeychain, renegadeConfig } from "./utils";

describe("Creating and Cancelling Orders", () => {
  test.concurrent(
    "Creating an order should result in the order being added to the Account's orders",
    async () => {
      // Setup the Account.
      const renegade = new Renegade(renegadeConfig);
      const accountId = renegade.registerAccount(globalKeychain);
      await renegade.initializeAccount(accountId);

      // Create and submit the Order.
      const order = new Order({
        baseToken: new Token({ ticker: "WETH" }),
        quoteToken: new Token({ ticker: "USDC" }),
        side: "buy",
        type: "limit",
        amount: BigInt(69),
        price: 2000,
      });
      console.log("Placing order:", order.serialize());
      await renegade.placeOrder(accountId, order);
      expect(renegade.getOrders(accountId)).toEqual({ [order.orderId]: order });

      await renegade.unregisterAccount(accountId);
      await renegade.teardown();
    },
  );
});
