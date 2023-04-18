import RenegadeError, { RenegadeErrorType } from "./errors";
import Keychain from "./keychain";
import {
  AccountId,
  Balance,
  BalanceId,
  Fee,
  FeeId,
  Order,
  OrderId,
} from "./types";

/**
 * A representation of a Renegade Account (aka a wallet). The authoritative
 * Account state is stored on-chain in StarkNet encrypted Account blobs, but we
 * use local Account state for fast querying and to avoid unnecessary on-chain
 * calls.
 */
export default class Account {
  // The current vector of Balances.
  private _balances: { [balanceId: BalanceId]: Balance };
  // The current vector of Orders.
  private _orders: { [orderId: OrderId]: Order };
  // The current vector of Fees.
  private _fees: { [feeId: FeeId]: Fee };
  // The Keychain that authorizes operations on this Account. Only one Account
  // can correspond to a given Keychain.
  private _keychain: Keychain;
  // The current hiding randomness.
  private _randomness: number; // TODO: Type with field elements here.
  // The AccountId is the unique identifier for this Account; AccountIds are
  // abstracted, but practically they are pk_view.
  private _accountId: AccountId;
  private _isInitialized: boolean;

  constructor(keychain: Keychain) {
    this._keychain = keychain;
    this._accountId = keychain.keyHierarchy.view.publicKey.toString("hex");
    this._isInitialized = false;
  }

  async initialize() {
    // Query the on-chain state to see if this Account is already registered.
    // If not registered, request Acount creation.
    this._isInitialized = true;
  }

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
    return this._balances;
  }

  /**
   * Getter for Orders.
   *
   * @throws {AccountNotInitialized} If the Account has not yet been initialized.
   */
  get orders() {
    this._assertInitialized();
    return this._orders;
  }

  /**
   * Getter for Fees.
   *
   * @throws {AccountNotInitialized} If the Account has not yet been initialized.
   */
  get fees() {
    this._assertInitialized();
    return this._fees;
  }

  /**
   * Getter for the Keychain.
   */
  get keychain() {
    return this._keychain;
  }

  /**
   * Getter for the AccountId.
   */
  get accountId() {
    return this._accountId;
  }
}
