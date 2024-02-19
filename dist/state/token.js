import tokenMappings from "../tokens/testnet.json";
export default class Token {
    address;
    // Static property to hold the cached ticker to address mapping
    static tickerToAddress = null;
    // Static property to hold the cached address to ticker mapping
    static addressToTicker = null;
    constructor(params) {
        if ((params.address && params.ticker) ||
            (!params.address && !params.ticker)) {
            throw new Error("Exactly one of address or ticker must be specified.");
        }
        // Initialize the mappings on first use
        if (Token.tickerToAddress === null || Token.addressToTicker === null) {
            Token.tickerToAddress = {};
            Token.addressToTicker = {};
            tokenMappings.tokens.forEach((token) => {
                const tickerUpper = token.ticker.toUpperCase();
                Token.tickerToAddress[tickerUpper] = token.address;
                Token.addressToTicker[token.address] = tickerUpper;
            });
        }
        if (params.ticker) {
            params.ticker = params.ticker.toUpperCase();
            const address = Token.tickerToAddress[params.ticker];
            if (address) {
                params.address = address;
            }
            else {
                throw new Error(`Unknown ticker: ${params.ticker}. Try using the params.address instead.`);
            }
        }
        this.address = params.address.toLowerCase().replace("0x", "");
    }
    get ticker() {
        const ticker = Token.addressToTicker[this.address];
        if (!ticker) {
            console.error(`Ticker not found for address: ${this.address}`);
            return null;
        }
        return ticker;
    }
    serialize() {
        return "0x" + this.address;
    }
    static deserialize(serializedToken) {
        return new Token({ address: serializedToken });
    }
    static findAddressByTicker(ticker) {
        try {
            return tokenMappings.tokens.find((token) => token.ticker === ticker)
                .address;
        }
        catch (e) {
            throw new Error(`Unknown ticker: ${ticker}`);
        }
    }
    static findTickerByAddress(address) {
        try {
            return tokenMappings.tokens.find((token) => token.address === address)
                .ticker;
        }
        catch (e) {
            throw new Error(`Could not find ${address} in mapping: ${this.addressToTicker}`);
        }
    }
}
