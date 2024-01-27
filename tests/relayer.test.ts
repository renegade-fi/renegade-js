import { describe, expect, test } from "vitest";
import { Renegade, RenegadeConfig } from "../src";
import RenegadeError from "../src/errors";
import { renegadeConfig } from "./utils";

describe("Relayer Ping", () => {
  test.concurrent("Ensure that the relayer is up", async () => {
    const renegade = new Renegade(renegadeConfig);
    try {
      await renegade.ping();
    } catch (e) {
      console.warn(
        `The relayer was not pingable. Ensure that a relayer is running at ${renegade.relayerHttpUrl}`,
      );
      throw e;
    } finally {
      await renegade.teardown();
    }
  });
});

describe("Renegade Object Parameters", () => {
  test.concurrent("An invalid relayer hostname should throw an error.", () => {
    const brokenRenegadeConfig: RenegadeConfig = {
      relayerHostname: "https://not-a-valid-hostname.com", // Hostname should not include protocol
    };
    expect(() => new Renegade(brokenRenegadeConfig)).toThrowError(
      RenegadeError,
    );
  });

  test.concurrent("An invalid relayer port should throw an error.", () => {
    const brokenRenegadeConfig1: RenegadeConfig = {
      relayerHostname: "localhost",
      relayerHttpPort: 0,
    };
    const brokenRenegadeConfig2: RenegadeConfig = {
      relayerHostname: "localhost",
      relayerHttpPort: 65536,
    };
    const brokenRenegadeConfig3: RenegadeConfig = {
      relayerHostname: "localhost",
      relayerHttpPort: 0.5,
    };
    expect(() => new Renegade(brokenRenegadeConfig1)).toThrowError(
      RenegadeError,
    );
    expect(() => new Renegade(brokenRenegadeConfig2)).toThrowError(
      RenegadeError,
    );
    expect(() => new Renegade(brokenRenegadeConfig3)).toThrowError(
      RenegadeError,
    );
  });

  test.concurrent("Can properly connect to a valid relayer URL.", async () => {
    const renegade = new Renegade(renegadeConfig);
    await renegade.ping();
    await renegade.teardown();
  });

  test.concurrent("Cannot connect to an invalid relayer URL", async () => {
    const brokenRenegadeConfig: RenegadeConfig = {
      relayerHostname: "no-relayer-here.com",
    };
    const renegade = new Renegade(brokenRenegadeConfig);
    try {
      await renegade.ping();
      fail("Should have thrown an error.");
    } catch (error) {
      expect(error).toBeInstanceOf(RenegadeError);
    }
    await renegade.teardown();
  });
});
