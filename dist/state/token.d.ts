export default class Token {
    readonly address: string;
    private static tickerToAddress;
    private static addressToTicker;
    constructor(params: {
        address?: string;
        ticker?: string;
    });
    get ticker(): string;
    get decimals(): number | null;
    serialize(): string;
    static deserialize(serializedToken: string): Token;
    static findAddressByTicker(ticker: string): string;
    /**
     * Finds and returns the ticker symbol for a given token address.
     *
     * @param {string} address - The token address to find the ticker for.
     * @returns `0x{string}` The ticker symbol associated with the given address.
     * @throws {Error} If the address is not found in the tokenMappings.
     */
    static findTickerByAddress(address: string): string;
}
