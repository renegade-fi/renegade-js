import { WalletId } from "../types";
import Balance from "./balance";
import Fee from "./fee";
import Keychain from "./keychain";
import Order from "./order";
import { bigIntToLimbs, generateId, limbsToBigInt } from "./utils";

export default class Wallet {
  public readonly walletId: WalletId;
  public readonly balances: Balance[];
  public readonly orders: Order[];
  public readonly fees: Fee[];
  public readonly keychain: Keychain;
  public readonly randomness: bigint;
  constructor(params: {
    id?: WalletId;
    balances: Balance[];
    orders: Order[];
    fees: Fee[];
    keychain: Keychain;
    randomness: bigint;
  }) {
    this.walletId =
      params.id ||
      (generateId(
        Buffer.from(params.keychain.keyHierarchy.view.publicKey.buffer),
      ) as WalletId);
    this.balances = params.balances;
    this.orders = params.orders;
    this.fees = params.fees;
    this.keychain = params.keychain;
    this.randomness = params.randomness;
  }

  serialize(asBigEndian?: boolean): string {
    return `{
      "id": "${this.walletId}",
      "balances": [${this.balances.map((b) => b.serialize()).join(",")}],
      "orders": [${this.orders.map((o) => o.serialize()).join(",")}],
      "fees": [${this.fees.map((f) => f.serialize()).join(",")}],
      "key_chain": ${this.keychain.serialize(asBigEndian)},
      "randomness": [${bigIntToLimbs(this.randomness).join(",")}]
    }`.replace(/[\s\n]/g, "");
  }

  static deserialize(serializedWallet: any, asBigEndian?: boolean): Wallet {
    const id = serializedWallet.id;
    const balances = serializedWallet.balances.map((b: any) =>
      Balance.deserialize(b),
    );
    const orders = serializedWallet.orders.map((o: any) =>
      Order.deserialize(o),
    );
    const fees = serializedWallet.fees.map((f: any) => Fee.deserialize(f));
    const keychain = Keychain.deserialize(
      serializedWallet.key_chain,
      asBigEndian,
    );
    const randomness = limbsToBigInt(serializedWallet.randomness);
    return new Wallet({ id, balances, orders, fees, keychain, randomness });
  }
}
