import Token from "../state/token";
import { Exchange } from "../types";
export declare class PriceReporterWs {
    private _ws;
    private _callbacks;
    private _baseUrl;
    constructor(baseUrl: string);
    getPrice(base: string, quote?: string, exchange?: Exchange): Promise<number>;
    getExchangePrices(baseToken: string, quoteToken?: string): Promise<{
        median: number;
        binance: number;
        coinbase: number;
        kraken: number;
        okx: number;
        uniswapv3: number;
    }>;
    private _subscribeToTopic;
    private _handleWsMessage;
    teardown(): void;
    subscribeToTokenPair(exchange: string, baseToken: Token, quoteToken: Token, callback: (price: string) => void): Promise<void>;
    private _awaitWsOpen;
}
