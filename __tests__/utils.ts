import * as fs from "fs";

import { Keychain, Order, OrderId, RenegadeConfig } from "../src";

export const RENEGADE_TEST_DIR = "./temp-test";
export const renegadeConfig: RenegadeConfig = {
  relayerHostname: "localhost",
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport: true,
  verbose: false,
  // taskDelay: 2500,
};
export const globalKeychain = new Keychain({
  skRoot: Buffer.from(
    "78ee3282122d10e87ce8e3d1fdeabddda3ec8f1fcc26a32730e8b0ed2d3f6e1a",
    "hex",
  ).reverse(),
});

export function executeTestWithCleanup(test: () => void) {
  // Clean up any previous runs.
  if (fs.existsSync(RENEGADE_TEST_DIR)) {
    fs.rmSync(RENEGADE_TEST_DIR, { recursive: true });
  }
  fs.mkdirSync(RENEGADE_TEST_DIR);
  test();
  // Clean up after the test.
  fs.rmSync(RENEGADE_TEST_DIR, { recursive: true });
}

// Equality check for orders, ignoring the timestamp.
export function expectOrderEquality(order1: Order, order2: Order) {
  expect(order1.orderId).toEqual(order2.orderId);
  expect(order1.baseToken).toEqual(order2.baseToken);
  expect(order1.quoteToken).toEqual(order2.quoteToken);
  expect(order1.side).toEqual(order2.side);
  expect(order1.type).toEqual(order2.type);
  expect(order1.amount).toEqual(order2.amount);
  expect(order1.minimumAmount).toEqual(order2.minimumAmount);
  expect(order1.worstPrice).toEqual(order2.worstPrice);
}

// Equality check for a hashmap of orders, ignoring the timestamp.
export function expectOrdersEquality(
  orders1: Record<OrderId, Order>,
  orders2: Record<OrderId, Order>,
) {
  expect(Object.keys(orders1).sort()).toEqual(Object.keys(orders2).sort());
  for (const orderId in orders1) {
    expectOrderEquality(orders1[orderId as OrderId], orders2[orderId as OrderId]);
  }
}
