import Token from "../state/token";
export declare class PriceReporterWs {
    private _ws;
    private _callbacks;
    constructor(priceReporterWsUrl: string);
    private _subscribeToTopic;
    private _handleWsMessage;
    teardown(): void;
    subscribeToTokenPair(exchange: string, baseToken: Token, quoteToken: Token, callback: (price: string) => void): Promise<void>;
    private _awaitWsOpen;
}
