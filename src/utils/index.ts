import WebSocket from "isomorphic-ws";
import * as uuid from "uuid";

import { sign_http_request } from "../../renegade-utils";
import RenegadeError, { RenegadeErrorType } from "../errors";
import { Keychain, Token } from "../state";
import {
  RENEGADE_AUTH_EXPIRATION_HEADER,
  RENEGADE_AUTH_HEADER,
} from "../state/utils";
import { AccountId, CallbackId, Exchange, TaskId } from "../types";
import { createZodFetcher } from "./fetcher";

export type TaskJob<R> = Promise<[TaskId, Promise<R>]>;
export type Priority = number;

export function unimplemented(): never {
  throw new Error("unimplemented");
}

export class RenegadeWs {
  // The WebSocket itself.
  private _ws: WebSocket;
  // If true, the WebSocket has sent an error event.
  private _wsError: boolean;
  // For each topic, contains a list of callbackIds to send messages to.
  private _topicListeners: Record<string, Set<[CallbackId, Priority]>>;
  // Lookup from callbackId to actual callback function.
  private _topicCallbacks: Record<CallbackId, (message: string) => void>;
  // Print verbose output.
  private _verbose: boolean;

  constructor(relayerWsUrl: string, verbose?: boolean) {
    this._ws = new WebSocket(relayerWsUrl);
    this._wsError = false;
    this._ws.addEventListener("error", () => {
      this._wsError = true;
    });
    this._ws.addEventListener(
      "message",
      (messageEvent: WebSocket.MessageEvent) => {
        this._handleWsMessage(messageEvent.data);
      },
    );
    this._topicListeners = {} as Record<string, Set<[CallbackId, Priority]>>;
    this._topicCallbacks = {} as Record<CallbackId, (message: string) => void>;
    this._verbose = verbose || false;
  }

  /**
   * Assert that the WebSocket has not reached an error state.
   */
  private _assertNoWsError() {
    if (this._wsError) {
      throw new RenegadeError(RenegadeErrorType.RelayerUnreachable);
    }
  }

  /**
   * Subscribe to a topic on the relayer.
   *
   * @param topic The topic to subscribe to.
   * @param keychain The keychain to use for authentication. If no authentication is required, leave undefined.
   */
  private async _subscribeToTopic(
    topic: string,
    keychain?: Keychain,
  ): Promise<void> {
    await this._awaitWsOpen();
    const message = {
      headers: {},
      body: {
        method: "subscribe",
        topic: topic,
      },
    };
    if (keychain) {
      const now = Date.now();
      const [renegadeAuth, renegadeAuthExpiration] = sign_http_request(
        JSON.stringify(message.body),
        BigInt(now),
        keychain.keyHierarchy.root.secretKey,
      );

      message.headers[RENEGADE_AUTH_HEADER] = renegadeAuth;
      message.headers[RENEGADE_AUTH_EXPIRATION_HEADER] = renegadeAuthExpiration;
    }
    this._ws.send(JSON.stringify(message));
  }

  /**
   * Main entrypoint for handling messages from the relayer WebSocket. We parse
   * the topic and transmit the message event to each registered callback.
   *
   * @param message A message from the relayer WebSocket.
   */
  private _handleWsMessage(message: string): void {
    if (this._verbose) {
      console.log(`[WebSocket] Received message: ${message}`);
    }
    try {
      // TODO: Should handle case where message = "HttpStatusCode(400, "signature format invalid")"
      const parsedMessage = JSON.parse(message);
      const topic = parsedMessage.topic;
      if (!(topic in this._topicListeners)) {
        return;
      }
      // Collect all callback IDs, and sort them in decreasing order by priority.
      const callbackIdsWithPriorities = Array.from(this._topicListeners[topic]);
      callbackIdsWithPriorities.sort((a, b) => b[1] - a[1]);
      for (const [callbackId] of callbackIdsWithPriorities) {
        this._topicCallbacks[callbackId](JSON.stringify(parsedMessage.event));
      }
    } catch (error) {
      console.error("Websocket error: ", error);
      console.error(`Error parsing message: ${message}`);
    }
  }

  /**
   * Await until the WebSocket connection to the relayer is open.
   */
  private async _awaitWsOpen(): Promise<void> {
    this._assertNoWsError();
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

  /**
   * For a given taskId, await the relayer until the task transitions to the
   * "Completed" state.
   *
   * TODO: Refactor this to use Self::registerTaskCallback
   *
   * @param taskId The UUID of the task to await.
   */
  async awaitTaskCompletion(taskId: TaskId): Promise<void> {
    if (taskId === undefined) {
      throw new RenegadeError(RenegadeErrorType.InvalidTaskId, "undefined");
    }
    if (taskId === ("DONE" as TaskId)) {
      return;
    }
    // TODO: Query the relayer for one-time task state, so that this function
    // immediately resolves if the task is already completed.
    await this._awaitWsOpen();
    const topic = `/v0/tasks/${taskId}`;
    const taskCompletionPromise = new Promise<void>((resolve) => {
      this._ws.addEventListener(
        "message",
        (messageEvent: WebSocket.MessageEvent) => {
          const parsedMessage = JSON.parse(messageEvent.data);
          if (
            parsedMessage.topic !== topic ||
            parsedMessage.event.type !== "TaskStatusUpdate"
          ) {
            return;
          }
          const state = parsedMessage.event.status.state;
          if (!state) {
            throw new Error("Could not find state in task update");
          }
          if (this._verbose) {
            console.log(`[WebSocket] New task state for ${taskId}: ${state}`);
          }
          if (state === "Completed") {
            resolve();
          }
        },
      );
    });
    await this._subscribeToTopic(topic);
    return taskCompletionPromise;
  }

  async registerAccountCallback(
    callback: (message: string) => void,
    accountId: AccountId,
    keychain: Keychain,
    priority?: Priority,
  ): Promise<CallbackId> {
    const topic = `/v0/wallet/${accountId.toString()}`;
    return await this._registerCallbackWithTopic(
      callback,
      topic,
      keychain,
      priority,
    );
  }

  async registerPriceReportCallback(
    callback: (message: string) => void,
    exchange: Exchange,
    baseToken: Token,
    quoteToken: Token,
    priority?: Priority,
  ): Promise<CallbackId> {
    const topic = `/v0/price_report/${exchange}/${baseToken.serialize()}/${quoteToken.serialize()}`;
    return await this._registerCallbackWithTopic(
      callback,
      topic,
      undefined,
      priority,
    );
  }

  async registerTaskCallback(
    callback: (message: string) => void,
    taskId: TaskId,
    priority?: Priority,
  ): Promise<CallbackId> {
    if (taskId === undefined) {
      throw new RenegadeError(
        RenegadeErrorType.InvalidTaskId,
        "Cannot register callback for taskId = undefined",
      );
    }
    if (taskId === ("DONE" as TaskId)) {
      throw new RenegadeError(
        RenegadeErrorType.InvalidTaskId,
        "Cannot register callback for taskId = DONE",
      );
    }
    const topic = `/v0/tasks/${taskId}`;
    return await this._registerCallbackWithTopic(
      callback,
      topic,
      undefined,
      priority,
    );
  }

  async registerOrderBookCallback(
    callback: (message: string) => void,
    priority?: Priority,
  ): Promise<CallbackId> {
    const topic = "/v0/order_book";
    return await this._registerCallbackWithTopic(
      callback,
      topic,
      undefined,
      priority,
    );
  }

  async registerNetworkCallback(
    callback: (message: string) => void,
    priority?: Priority,
  ): Promise<CallbackId> {
    const topic = "/v0/network";
    return await this._registerCallbackWithTopic(
      callback,
      topic,
      undefined,
      priority,
    );
  }

  async registerMpcCallback(
    callback: (message: string) => void,
    priority?: Priority,
  ): Promise<CallbackId> {
    const topic = "/v0/handshake";
    return await this._registerCallbackWithTopic(
      callback,
      topic,
      undefined,
      priority,
    );
  }

  async _registerCallbackWithTopic(
    callback: (message: string) => void,
    topic: string,
    keychain?: Keychain,
    priority?: Priority,
  ): Promise<CallbackId> {
    await this._awaitWsOpen();
    await this._subscribeToTopic(topic, keychain);
    if (!this._topicListeners[topic]) {
      this._topicListeners[topic] = new Set<[CallbackId, Priority]>();
    }
    const callbackId = uuid.v4() as CallbackId;
    this._topicCallbacks[callbackId] = callback;
    this._topicListeners[topic].add([callbackId, priority || 0]);
    return callbackId;
  }

  async releaseCallback(callbackId: CallbackId): Promise<void> {
    if (!this._topicCallbacks[callbackId]) {
      throw new RenegadeError(RenegadeErrorType.CallbackNotRegistered);
    }
    delete this._topicCallbacks[callbackId];
    for (const topic of Object.keys(this._topicListeners)) {
      for (const [topicCallbackId, priority] of this._topicListeners[topic]) {
        if (topicCallbackId === callbackId) {
          this._topicListeners[topic].delete([topicCallbackId, priority]);
        }
      }
    }
    // TODO: If we released the last remaining callback for this topic,
    // unsubscribe from the relayer's messages.
  }

  teardown(): void {
    if (!this._wsError) {
      this._ws.close();
    }
  }
}

export { createZodFetcher };
