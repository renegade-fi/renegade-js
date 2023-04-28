import WebSocket from "ws";

import RenegadeError, { RenegadeErrorType } from "../errors";
import { TaskId } from "../types";

export function unimplemented(): never {
  throw new Error("unimplemented");
}

export class RenegadeWs {
  private _ws: WebSocket;
  private _wsError: boolean;

  constructor(relayerWsUrl: string) {
    this._ws = new WebSocket(relayerWsUrl);
    this._ws.on("error", () => {
      this._wsError = true;
    });
  }

  private _assertNoWsError() {
    if (this._wsError) {
      throw new RenegadeError(RenegadeErrorType.RelayerUnreachable);
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
        this._ws.on("open", () => {
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
  async awaitTaskCompletion(taskId: TaskId, verbose?: boolean): Promise<void> {
    // TODO: Query the relayer for one-time task state, so that this function
    // immediately resolves if the task is already completed.
    await this._awaitWsOpen();
    const topic = `/v0/tasks/${taskId}`;
    this._ws.send(
      JSON.stringify({
        headers: {},
        body: {
          method: "subscribe",
          topic: topic,
        },
      }),
    );
    return new Promise((resolve) => {
      this._ws.on("message", (data) => {
        const message = JSON.parse(data.toString());
        if (
          message.topic !== topic ||
          message.event.type !== "TaskStatusUpdate"
        ) {
          return;
        }
        if (verbose) {
          console.log(
            `New task state for ${taskId}: ${message.event.state.state}`,
          );
        }
        if (message.event.state.state === "Completed") {
          resolve();
        }
      });
    });
  }

  async teardown(): Promise<void> {
    if (!this._wsError) {
      await this._ws.close();
    }
  }
}
