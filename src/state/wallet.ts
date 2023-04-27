import { WalletId } from "../types";
import Balance from "./balance";
import Fee from "./fee";
import Keychain from "./keychain";
import Order from "./order";
import { generateId } from "./utils";

export default class Wallet {
  public readonly walletId: WalletId;
  constructor(
    public readonly balances: Balance[],
    public readonly orders: Order[],
    public readonly fees: Fee[],
    public readonly keychain: Keychain,
    public readonly randomness: bigint,
  ) {
    this.walletId = generateId(
      Buffer.from(keychain.keyHierarchy.view.publicKey.buffer),
    );
  }

  serialize(asBigEndian?: boolean): string {
    const randomnessSerialized = [
      (this.randomness >> 96n) % 2n ** 32n,
      (this.randomness >> 64n) % 2n ** 32n,
      (this.randomness >> 32n) % 2n ** 32n,
      this.randomness % 2n ** 32n,
    ];
    return `{
      "id": "${this.walletId}",
      "orders": [],
      "balances": [],
      "fees": [],
      "key_chain": ${this.keychain.serialize(asBigEndian)},
      "randomness": [${randomnessSerialized.join(",")}]
    }`.replace(/[\s\n]/g, "");
  }

  static deserialize(serializedWallet: any): Wallet {
    let randomness: bigint;
    if (serializedWallet.randomness.length === 0) {
      randomness = 0n;
    } else {
      randomness =
        BigInt(serializedWallet.randomness[0]) * 2n ** 96n +
        BigInt(serializedWallet.randomness[1]) * 2n ** 64n +
        BigInt(serializedWallet.randomness[2]) * 2n ** 32n +
        BigInt(serializedWallet.randomness[3]);
    }
    const keychain = Keychain.deserialize(serializedWallet.key_chain);
    return new Wallet([], [], [], keychain, randomness);
  }
}
