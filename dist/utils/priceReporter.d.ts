import Token from "../state/token";
import { Exchange } from "../types";
export declare class PriceReporterWs {
    private _ws;
    private _callbacks;
    private _baseUrl;
    constructor(baseUrl: string);
    getPrice(baseToken: string, quoteToken?: string, exchange?: Exchange): Promise<number>;
    private _subscribeToTopic;
    private _handleWsMessage;
    teardown(): void;
    subscribeToTokenPair(exchange: string, baseToken: Token, quoteToken: Token, callback: (price: string) => void): Promise<void>;
    private _awaitWsOpen;
}
