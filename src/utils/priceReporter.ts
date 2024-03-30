import axios, { AxiosRequestConfig } from "axios";
import Token from "../state/token";
import WebSocket from "isomorphic-ws";
import { Exchange } from "../types";

export class PriceReporterWs {
  private _ws: WebSocket;
  private _callbacks: Map<string, (price: string) => void>;
  private _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
    this._ws = new WebSocket(`wss://${baseUrl}:4000`);
    this._ws.addEventListener("open", () => {
      // No subscription is made when the WebSocket is opened
    });
    this._ws.addEventListener(
      "message",
      (messageEvent: WebSocket.MessageEvent) => {
        this._handleWsMessage(messageEvent.data);
      },
    );
    this._callbacks = new Map();
  }

  async getPrice(
    baseToken: string,
    quoteToken: string = "USDT",
    exchange: Exchange = Exchange.Binance,
  ): Promise<number> {
    const topic = `${exchange}-${Token.findAddressByTicker(
      baseToken,
    )}-${Token.findAddressByTicker(quoteToken)}`;
    const request: AxiosRequestConfig = {
      method: "GET",
      url: `https://${this._baseUrl}:3000/price/${topic}`,
    };
    const response = await axios(request);
    return response.data;
  }

  private _subscribeToTopic(topic: string): void {
    console.log("Subscribing to topic", topic);
    this._ws.send(JSON.stringify({ method: "subscribe", topic }));
  }

  private _handleWsMessage(message: string): void {
    const parsedMessage = JSON.parse(message);
    const topic = parsedMessage.topic;
    const price = parsedMessage.price;
    const callback = this._callbacks.get(topic);
    if (callback) {
      callback(price);
    }
  }

  teardown(): void {
    this._ws.close();
  }

  async subscribeToTokenPair(
    exchange: string,
    baseToken: Token,
    quoteToken: Token,
    callback: (price: string) => void,
  ): Promise<void> {
    await this._awaitWsOpen();
    // TODO: USDT is hardcoded here
    const topic = `${exchange}-${Token.findAddressByTicker(
      baseToken.ticker,
    )}-${Token.findAddressByTicker("USDT")}`;
    if (this._callbacks.has(topic)) {
      console.log("Topic already exists, skipping subscription");
      return;
    }
    this._callbacks.set(topic, callback);
    this._subscribeToTopic(topic);
  }

  private _awaitWsOpen(): Promise<void> {
    return new Promise((resolve) => {
      if (this._ws.readyState === WebSocket.OPEN) {
        resolve();
      } else {
        this._ws.addEventListener("open", () => {
          resolve();
        });
      }
    });
  }
}
