import axios from "axios";
import Token from "../state/token";
import WebSocket from "isomorphic-ws";
import { Exchange } from "../types";
const DEFAULT_QUOTE = {
    [Exchange.Binance]: `${Token.findAddressByTicker("USDT")}`,
    [Exchange.Coinbase]: `${Token.findAddressByTicker("USDC")}`,
    [Exchange.Kraken]: "0x0000000000000000000000000000000000000000",
    [Exchange.Okx]: `${Token.findAddressByTicker("USDT")}`,
    [Exchange.Median]: `${Token.findAddressByTicker("USDT")}`,
    [Exchange.Uniswapv3]: `${Token.findAddressByTicker("USDT")}`,
};
export class PriceReporterWs {
    _ws;
    _callbacks;
    _baseUrl;
    constructor(baseUrl) {
        this._baseUrl = baseUrl;
        this._ws = new WebSocket(`wss://${baseUrl}:4000`);
        this._ws.addEventListener("open", () => {
            // No subscription is made when the WebSocket is opened
        });
        this._ws.addEventListener("message", (messageEvent) => {
            this._handleWsMessage(messageEvent.data);
        });
        this._callbacks = new Map();
    }
    async getPrice(base, quote, exchange = Exchange.Binance) {
        let quoteToken = new Token({ address: DEFAULT_QUOTE[exchange] });
        if (quote) {
            quoteToken = new Token({ ticker: quote });
        }
        const topic = `${exchange}-${Token.findAddressByTicker(base)}-0x${quoteToken.address}`;
        const request = {
            method: "GET",
            url: `https://${this._baseUrl}:3000/price/${topic}`,
            timeout: 4000,
        };
        const response = await axios(request);
        return response.data;
    }
    async getExchangePrices(baseToken, quoteToken) {
        const prices = {
            [Exchange.Median]: 0,
            [Exchange.Uniswapv3]: 0,
            [Exchange.Binance]: 0,
            [Exchange.Coinbase]: 0,
            [Exchange.Kraken]: 0,
            [Exchange.Okx]: 0,
        };
        const exchanges = [
            Exchange.Binance,
            Exchange.Coinbase,
            Exchange.Kraken,
            Exchange.Okx,
        ];
        await Promise.all(exchanges.map(async (exchange) => {
            try {
                const price = await this.getPrice(baseToken, quoteToken, exchange);
                prices[exchange] = price;
            }
            catch (error) {
                console.error(`An error occurred while fetching price for ${exchange}:`, error.response.data);
                prices[exchange] = 0; // Set price to 0 in case of an error
            }
        }));
        return prices;
    }
    _subscribeToTopic(topic) {
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
