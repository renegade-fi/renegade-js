import * as uuid from "uuid";
import WebSocket from "isomorphic-ws";
import RenegadeError, { RenegadeErrorType } from "../errors";
import { RENEGADE_AUTH_EXPIRATION_HEADER, RENEGADE_AUTH_HEADER, } from "../state/utils";
export function unimplemented() {
    throw new Error("unimplemented");
}
export class RenegadeWs {
    constructor(relayerWsUrl, verbose) {
        this._ws = new WebSocket(relayerWsUrl);
        this._wsError = false;
        this._ws.addEventListener("error", () => {
            this._wsError = true;
        });
        this._ws.addEventListener("message", (messageEvent) => {
            this._handleWsMessage(messageEvent.data);
        });
        this._topicListeners = {};
        this._topicCallbacks = {};
        this._verbose = verbose || false;
    }
    /**
     * Assert that the WebSocket has not reached an error state.
     */
    _assertNoWsError() {
        if (this._wsError) {
            throw new RenegadeError(RenegadeErrorType.RelayerUnreachable);
        }
    }
    /**
     * Subscribe to a topic on the relayer.
     *
     * @param topic The topic to subscribe to.
     */
    async _subscribeToTopic(topic, keychain, isAuthenticated) {
        await this._awaitWsOpen();
        const message = {
            headers: {},
            body: {
                method: "subscribe",
                topic: topic,
            },
        };
        if (isAuthenticated) {
            const [renegadeAuth, renegadeAuthExpiration] = keychain.generateExpiringSignature(Buffer.from(JSON.stringify(message.body), "ascii"));
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
    _handleWsMessage(message) {
        if (this._verbose) {
            console.log(`[WebSocket] Received message: ${message}`);
        }
        const parsedMessage = JSON.parse(message);
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
    async _awaitWsOpen() {
        this._assertNoWsError();
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
    /**
     * For a given taskId, await the relayer until the task transitions to the
     * "Completed" state.
     *
     * @param taskId The UUID of the task to await.
     */
    async awaitTaskCompletion(taskId) {
        if (taskId === undefined) {
            throw new RenegadeError(RenegadeErrorType.InvalidTaskId, "undefined");
        }
        if (taskId === "DONE") {
            return;
        }
        // TODO: Query the relayer for one-time task state, so that this function
        // immediately resolves if the task is already completed.
        await this._awaitWsOpen();
        const topic = `/v0/tasks/${taskId}`;
        const taskCompletionPromise = new Promise((resolve) => {
            this._ws.addEventListener("message", (messageEvent) => {
                const parsedMessage = JSON.parse(messageEvent.data);
                if (parsedMessage.topic !== topic ||
                    parsedMessage.event.type !== "TaskStatusUpdate") {
                    return;
                }
                if (this._verbose) {
                    console.log(`[WebSocket] New task state for ${taskId}: ${parsedMessage.event.state.state}`);
                }
                if (parsedMessage.event.state.state === "Completed") {
                    resolve();
                }
            });
        });
        await this._subscribeToTopic(topic);
        return taskCompletionPromise;
    }
    async registerAccountCallback(callback, accountId, keychain) {
        const topic = `/v0/wallet/${accountId.toString()}`;
        await this._subscribeToTopic(topic, keychain, true);
        if (!this._topicListeners[topic]) {
            this._topicListeners[topic] = new Set();
        }
        const callbackId = uuid.v4();
        this._topicCallbacks[callbackId] = callback;
        this._topicListeners[topic].add(callbackId);
        return callbackId;
    }
    async releaseCallback(callbackId) {
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
    teardown() {
        if (!this._wsError) {
            this._ws.close();
        }
    }
}
