import * as uuid from "uuid";
import WebSocket from "ws";

import RenegadeError, { RenegadeErrorType } from "../errors";
import { Keychain } from "../state";
import {
  RENEGADE_AUTH_EXPIRATION_HEADER,
  RENEGADE_AUTH_HEADER,
} from "../state/utils";
import { AccountId, CallbackId, TaskId } from "../types";

export function unimplemented(): never {
  throw new Error("unimplemented");
}

export class RenegadeWs {
  // The WebSocket itself.
  private _ws: WebSocket;
  // If true, the WebSocket has sent an error event.
  private _wsError: boolean;
  // For each topic, contains a list of callbackIds to send messages to.
  private _topicListeners: Record<string, Set<CallbackId>>;
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
    this._topicListeners = {} as Record<string, Set<CallbackId>>;
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
   */
  private async _subscribeToTopic(
    topic: string,
    keychain?: Keychain,
    isAuthenticated?: boolean,
  ): Promise<void> {
    await this._awaitWsOpen();
    const message = {
      headers: {},
      body: {
        method: "subscribe",
        topic: topic,
      },
    };
    if (isAuthenticated) {
      const [renegadeAuth, renegadeAuthExpiration] =
        keychain.generateExpiringSignature(
          Buffer.from(JSON.stringify(message.body), "ascii"),
        );
      message.headers[RENEGADE_AUTH_HEADER] = JSON.stringify(renegadeAuth);
      message.headers[RENEGADE_AUTH_EXPIRATION_HEADER] =
        renegadeAuthExpiration.toString();
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

    let parsedMessage: any;
    try {
      parsedMessage = JSON.parse(message);
    } catch (e) {
      // Certain messages from the relayer are not JSON-compliant, and we can
      // ignore them.
      return;
    }
    const topic = parsedMessage.topic;
    if (!(topic in this._topicListeners)) {
      return;
    }
    for (const callbackId of this._topicListeners[topic]) {
      this._topicCallbacks[callbackId](JSON.stringify(parsedMessage.event));
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
   * @param taskId The UUID of the task to await.
   */
  async awaitTaskCompletion(taskId: TaskId): Promise<void> {
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
          const message = messageEvent.data;
          let parsedMessage: any;
          try {
            parsedMessage = JSON.parse(message);
          } catch (e) {
            // Certain messages from the relayer are not JSON-compliant, and we can
            // ignore them.
            return;
          }
          if (
            parsedMessage.topic !== topic ||
            parsedMessage.event.type !== "TaskStatusUpdate"
          ) {
            return;
          }
          if (this._verbose) {
            console.log(
              `[WebSocket] New task state for ${taskId}: ${parsedMessage.event.state.state}`,
            );
          }
          if (parsedMessage.event.state.state === "Completed") {
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
  ): Promise<CallbackId> {
    const topic = `/v0/wallet/${accountId.toString()}`;
    await this._subscribeToTopic(topic, keychain, true);
    if (!this._topicListeners[topic]) {
      this._topicListeners[topic] = new Set<CallbackId>();
    }
    const callbackId = uuid.v4() as CallbackId;
    this._topicCallbacks[callbackId] = callback;
    this._topicListeners[topic].add(callbackId);
    return callbackId;
  }

  async releaseCallback(callbackId: CallbackId): Promise<void> {
    if (!this._topicCallbacks[callbackId]) {
      throw new RenegadeError(RenegadeErrorType.CallbackNotRegistered);
    }
    delete this._topicCallbacks[callbackId];
    for (const topic of Object.keys(this._topicListeners)) {
      this._topicListeners[topic].delete(callbackId);
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
