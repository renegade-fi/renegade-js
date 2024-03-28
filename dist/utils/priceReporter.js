import Token from "../state/token";
import WebSocket from "isomorphic-ws";
export class PriceReporterWs {
    _ws;
    _callbacks;
    constructor(priceReporterWsUrl) {
        this._ws = new WebSocket(priceReporterWsUrl);
        this._ws.addEventListener("open", () => {
            // No subscription is made when the WebSocket is opened
        });
        this._ws.addEventListener("message", (messageEvent) => {
            this._handleWsMessage(messageEvent.data);
        });
        this._callbacks = new Map();
    }
    _subscribeToTopic(topic) {
        console.log("Subscribing to topic", topic);
        this._ws.send(JSON.stringify({ method: "subscribe", topic }));
    }
    _handleWsMessage(message) {
        const parsedMessage = JSON.parse(message);
        const topic = parsedMessage.topic;
        const price = parsedMessage.price;
        const callback = this._callbacks.get(topic);
        if (callback) {
            callback(price);
        }
    }
    teardown() {
        this._ws.close();
    }
    async subscribeToTokenPair(exchange, baseToken, quoteToken, callback) {
        await this._awaitWsOpen();
        // TODO: USDT is hardcoded here
        const topic = `${exchange}-${Token.findAddressByTicker(baseToken.ticker)}-${Token.findAddressByTicker("USDT")}`;
        if (this._callbacks.has(topic)) {
            console.log("Topic already exists, skipping subscription");
            return;
        }
        this._callbacks.set(topic, callback);
        this._subscribeToTopic(topic);
    }
    _awaitWsOpen() {
        return new Promise((resolve) => {
            if (this._ws.readyState === WebSocket.OPEN) {
                resolve();
            }
            else {
                this._ws.addEventListener("open", () => {
                    resolve();
                });
            }
        });
    }
}
