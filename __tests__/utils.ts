import * as fs from "fs";

import { Keychain, RenegadeConfig } from "../src";

export const RENEGADE_TEST_DIR = "./temp-test";
export const renegadeConfig: RenegadeConfig = {
  relayerHostname: "localhost",
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport: true,
  verbose: false,
  taskDelay: 1000,
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
