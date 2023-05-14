import { Keychain } from "../state";
import { AccountId, CallbackId, TaskId } from "../types";
export type TaskJob<R> = Promise<[TaskId, Promise<R>]>;
export declare function unimplemented(): never;
export declare class RenegadeWs {
    private _ws;
    private _wsError;
    private _topicListeners;
    private _topicCallbacks;
    private _verbose;
    constructor(relayerWsUrl: string, verbose?: boolean);
    /**
     * Assert that the WebSocket has not reached an error state.
     */
    private _assertNoWsError;
    /**
     * Subscribe to a topic on the relayer.
     *
     * @param topic The topic to subscribe to.
     */
    private _subscribeToTopic;
    /**
     * Main entrypoint for handling messages from the relayer WebSocket. We parse
     * the topic and transmit the message event to each registered callback.
     *
     * @param message A message from the relayer WebSocket.
     */
    private _handleWsMessage;
    /**
     * Await until the WebSocket connection to the relayer is open.
     */
    private _awaitWsOpen;
    /**
     * For a given taskId, await the relayer until the task transitions to the
     * "Completed" state.
     *
     * @param taskId The UUID of the task to await.
     */
    awaitTaskCompletion(taskId: TaskId): Promise<void>;
    registerAccountCallback(callback: (message: string) => void, accountId: AccountId, keychain: Keychain): Promise<CallbackId>;
    releaseCallback(callbackId: CallbackId): Promise<void>;
    teardown(): void;
}