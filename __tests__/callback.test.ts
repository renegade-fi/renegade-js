import { Renegade, Token, Exchange } from "../src";
import { renegadeConfig } from "./utils";

describe("Events Streaming", () => {
  test.concurrent("Streaming price reports should work", async () => {
    const renegade = new Renegade(renegadeConfig);
    let receivedAnyMessage = false;
    const callback = (message: string) => {
      receivedAnyMessage = true;
    };
    renegade.registerPriceReportCallback(
      callback,
      Exchange.Median,
      new Token({ ticker: "WBTC" }),
      new Token({ ticker: "USDC" }),
    );
    renegade.registerPriceReportCallback(
      callback,
      Exchange.Binance,
      new Token({ ticker: "WBTC" }),
      new Token({ ticker: "USDC" }),
    );
    renegade.registerPriceReportCallback(
      callback,
      Exchange.Coinbase,
      new Token({ ticker: "WBTC" }),
      new Token({ ticker: "USDC" }),
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));
    expect(receivedAnyMessage).toBe(true);
    await renegade.teardown();
  });
});
