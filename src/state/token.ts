import tokenMappings from "../tokens/testnet.json";

export default class Token {
  public readonly address: string;
  // Static property to hold the cached ticker to address mapping
  private static tickerToAddress: { [key: string]: string } | null = null;
  // Static property to hold the cached address to ticker mapping
  private static addressToTicker: { [key: string]: string } | null = null;

  constructor(params: { address?: string; ticker?: string }) {
    if (
      (params.address && params.ticker) ||
      (!params.address && !params.ticker)
    ) {
      throw new Error("Exactly one of address or ticker must be specified.");
    }

    // Initialize the mappings on first use
    if (Token.tickerToAddress === null || Token.addressToTicker === null) {
      Token.tickerToAddress = {};
      Token.addressToTicker = {};
      tokenMappings.tokens.forEach((token) => {
        const tickerUpper = token.ticker.toUpperCase();
        Token.tickerToAddress![tickerUpper] = token.address;
        Token.addressToTicker![token.address] = tickerUpper;
      });
    }

    if (params.ticker) {
      params.ticker = params.ticker.toUpperCase();
      const address = Token.tickerToAddress[params.ticker];
      if (address) {
        params.address = address;
      } else {
        throw new Error(
          `Unknown ticker: ${params.ticker}. Try using the params.address instead.`,
        );
      }
    }

    this.address = params.address.toLowerCase().replace("0x", "");
  }

  public get ticker() {
    const ticker = Token.addressToTicker[`0x${this.address}`];
    if (!ticker) {
      console.error(`Ticker not found for address: ${this.address}`);
      throw new Error(`Ticker not found for address: ${this.address}`);
    }
    return ticker;
  }

  public get decimals(): number | null {
    const tokenInfo = tokenMappings.tokens.find(
      (token) => token.address === "0x" + this.address,
    );
    if (!tokenInfo) {
      console.error(`Decimals not found for address: 0x${this.address}`);
      return null;
    }
    return tokenInfo.decimals;
  }

  serialize(): string {
    return "0x" + this.address;
  }

  static deserialize(serializedToken: string): Token {
    return new Token({ address: serializedToken });
  }

  public static findAddressByTicker(ticker: string): string {
    try {
      return tokenMappings.tokens.find((token) => token.ticker === ticker)
        .address;
    } catch (e) {
      throw new Error(`Unknown ticker: ${ticker}`);
    }
  }

  /**
   * Finds and returns the ticker symbol for a given token address.
   *
   * @param {string} address - The token address to find the ticker for.
   * @returns `0x{string}` The ticker symbol associated with the given address.
   * @throws {Error} If the address is not found in the tokenMappings.
   */
  public static findTickerByAddress(address: string): string {
    try {
      return tokenMappings.tokens.find((token) => token.address === address)
        .ticker;
    } catch (e) {
      throw new Error(
        `Could not find ${address} in mapping: ${this.addressToTicker}`,
      );
    }
  }
}
