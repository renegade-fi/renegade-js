# Renegade Typescript Client

This is a Typescript wrapper of the Renegade relayer API, for use in both
internal trading systems and the GUI.

### Getting Started

This is an example of `renegade-js` usage with a local relayer:

```
import {
  Renegade,
  Keychain,
  Order,
  Token,
} from "@renegade-fi/renegade-js"

// Configure a new Renegade client. Ensure that a relayer is running at 127.0.0.1
const renegade = new Renegade({
  relayerHostname: "localhost",
  useInsecureTransport: true,
});

// Create a keychain from a seed and register a new account on-chain
const keychain = new Keychain({ seed: "seed123" });
const accountId = renegade.registerAccount(keychain);
await renegade.initializeAccount(accountId);

// Create and submit an order
const order = new Order({
  baseToken: new Token({ ticker: "WETH" }),
  quoteToken: new Token({ ticker: "USDC" }),
  side: "buy",
  type: "limit",
  amount: BigInt(5),
  price: 2000,
});
await renegade.placeOrder(accountId, order);

// Query the on-chain orders to see that the order was placed
console.log("Current orders:", renegade.getOrders(accountId));

// Teardown to close websockets
await renegade.teardown();
```
