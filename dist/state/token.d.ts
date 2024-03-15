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
    static findTickerByAddress(address: string): string;
}
