import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import crypto from "crypto";
import Uuid from "uuid";
import WebSocket from "ws";

import RenegadeError, { RenegadeErrorType } from "./errors";
import Keychain from "./keychain";
import { Balance, Fee, Order, Wallet } from "./wallet";

const RENEGADE_AUTH_HEADER = "renegade-auth";
const RENEGADE_AUTH_EXPIRATION_HEADER = "renegade-auth-expiration";
const SIG_VALIDITY_WINDOW_MS = 10_000;
// https://doc.dalek.rs/curve25519_dalek/constants/constant.BASEPOINT_ORDER.html
const BASEPOINT_ORDER =
  BigInt(2) ** BigInt(252) + BigInt("0x14def9dea2f79cd65812631a5cf5d3ed");

/**
 * A Renegade Account, which is a thin wrapper over the Wallet abstraction. The
 * authoritative Wallet state is stored on-chain in StarkNet encrypted Wallet
 * blobs, but we use local Wallet state for fast querying and to avoid
 * unnecessary on-chain calls.
 *
 * The Account class is responsible for managing the local Wallet state,
 * including streaming Wallet events in real-time from the relayer.
 */
export default class Account {
  // Fully-qualified URL of the relayer HTTP API.
  private _relayerHttpUrl: string;
  // Fully-qualified URL of the relayer WebSocket API.
  private _relayerWsUrl: string;
  // The WebSocket connection to the relayer.
  private _ws: WebSocket;
  // The current Wallet state.
  private _wallet: Wallet;
  // Has this Account been initialized?
  private _isInitialized: boolean;

  constructor(
    keychain: Keychain,
    relayerHttpUrl: string,
    relayerWsUrl: string,
  ) {
    this._relayerHttpUrl = relayerHttpUrl;
    this._relayerWsUrl = relayerWsUrl;
    this._ws = new WebSocket(this._relayerWsUrl);
    this._wallet = new Wallet([], [], [], keychain, this._generateRandomness());
    this._isInitialized = false;
  }

  /**
   * Generate blinding randomness, used to populate initial empty wallet state.
   *
   * @returns The generated randomness.
   */
  _generateRandomness(): bigint {
    const sampleLimb = () => BigInt(crypto.randomInt(2 ** 32));
    const randomness =
      sampleLimb() +
      sampleLimb() * 2n ** 32n +
      sampleLimb() * 2n ** 64n +
      sampleLimb() * 2n ** 96n;
    // Note that sampling in this manner slightly biases the randomness; should
    // not be a big issue since the bias is extremely small.
    return randomness % BASEPOINT_ORDER;
  }

  async initialize() {
    // Query the relayer to see if this Account is already registered in relayer state.
    const relayerWallet = await this._queryRelayerForWallet();
    if (relayerWallet) {
      // TODO: Assign these actual Wallet values to the Account.
      this._isInitialized = true;
      return;
    }
    // Query the relayer to see if this Account is present in on-chain state.
    const onchainWallet = await this._queryChainForWallet();
    if (onchainWallet) {
      // TODO: Assign these actual Wallet values to the Account.
      this._isInitialized = true;
      return;
    }
    // The Wallet is not present in on-chain state, so we need to create it.
    await this._createNewWallet();
    this._isInitialized = true;
  }

  /**
   * Tear down the Account, including closing the WebSocket connection to the
   * relayer.
   */
  async teardown(): Promise<void> {
    this._isInitialized = false;
    await this._awaitWsOpen();
    this._ws.close();
  }

  private _expiringSignature(
    request: AxiosRequestConfig,
    validUntil: number,
  ): Uint8Array {
    const validUntilBuffer = Buffer.alloc(8);
    validUntilBuffer.writeBigUInt64LE(BigInt(validUntil));
    const signatureMessage = Buffer.concat([
      Buffer.from(request.data.toString(), "ascii"),
      validUntilBuffer,
    ]);
    const sig =
      this._wallet.keychain.keyHierarchy.root.signMessage(signatureMessage);
    return sig;
  }

  private async _transmitHttpRequest(
    request: AxiosRequestConfig,
    isAuthenticated: boolean,
  ): Promise<AxiosResponse> {
    if (isAuthenticated) {
      request.headers = request.headers || {};
      // const validUntil = Date.now() + SIG_VALIDITY_WINDOW_MS;
      const validUntil = 1692318847714 + SIG_VALIDITY_WINDOW_MS;
      request.headers[RENEGADE_AUTH_HEADER] =
        "[" +
        Array.from(this._expiringSignature(request, validUntil)).toString() +
        "]";
      request.headers[RENEGADE_AUTH_EXPIRATION_HEADER] = validUntil;
    }
    return await axios.request(request);
  }

  /**
   * Await until the WebSocket connection to the relayer is open.
   */
  private async _awaitWsOpen(): Promise<void> {
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
  private async _awaitTaskCompletion(taskId: Uuid): Promise<void> {
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
        console.log(
          `New task state for ${taskId}: ${message.event.state.state}`,
        );
        if (message.event.state.state === "Completed") {
          resolve();
        }
      });
    });
  }

  /**
   * Query the relayer to lookup the Wallet corresponding to this AccountId.
   * Note that this does not check the on-chain state; it simply checks if the
   * given AccountId is present in the relayer's local state.
   *
   * @returns The Wallet if it exists in the relayer's local state, or undefined
   * if it does not.
   */
  private async _queryRelayerForWallet(): Promise<Wallet | undefined> {
    const request: AxiosRequestConfig = {
      method: "GET",
      url: `${this._relayerHttpUrl}/v0/wallet/${this._wallet.walletId}`,
      data: "{}",
      validateStatus: () => true,
    };
    const response = await this._transmitHttpRequest(request, true);
    if (response.status === 200) {
      return Wallet.deserialize(response.data.wallet);
    } else {
      console.log("Could not find wallet in relayer local state.");
      return undefined;
    }
  }

  /**
   * Query the on-chain state to lookup the Wallet corresponding to this
   * AccountId.
   *
   * @returns The Wallet if it exists in on-chain state, or undefined if it has
   * not yet been created.
   */
  private async _queryChainForWallet(): Promise<Wallet | undefined> {
    // TODO
    return undefined;
  }

  /**
   * Create a new Wallet on-chain. Awaits full task completion.
   */
  private async _createNewWallet(): Promise<void> {
    // Query the relayer to create a new Wallet.
    const request: AxiosRequestConfig = {
      method: "POST",
      url: `${this._relayerHttpUrl}/v0/wallet`,
      data: `{"wallet":${this._wallet.serialize(true)}}`,
      validateStatus: () => true,
    };
    const response = await this._transmitHttpRequest(request, false);
    await this._awaitTaskCompletion(response.data.task_id);
  }

  /**
   * Assert that the Account has been initialized, meaning that the Wallet is
   * now managed by the relayer and wallet update events are actively streaming
   * to the Account.
   *
   * @throws {AccountNotInitialized} If the Account has not yet been initialized.
   */
  private _assertInitialized() {
    if (!this._isInitialized) {
      throw new RenegadeError(RenegadeErrorType.AccountNotInitialized);
    }
  }

  /**
   * Getter for Balances.
   *
   * @throws {AccountNotInitialized} If the Account has not yet been initialized.
   */
  get balances() {
    this._assertInitialized();
    return this._wallet.balances;
  }

  /**
   * Getter for Orders.
   *
   * @throws {AccountNotInitialized} If the Account has not yet been initialized.
   */
  get orders() {
    this._assertInitialized();
    return this._wallet.orders;
  }

  /**
   * Getter for Fees.
   *
   * @throws {AccountNotInitialized} If the Account has not yet been initialized.
   */
  get fees() {
    this._assertInitialized();
    return this._wallet.fees;
  }

  /**
   * Getter for the Keychain.
   */
  get keychain() {
    return this._wallet.keychain;
  }

  /**
   * Getter for the AccountId.
   */
  get accountId() {
    return this._wallet.walletId;
  }
}
