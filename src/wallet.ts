/**
 * Here, we define stateless primitives for individual Wallets in the Renegade
 * network, with serialization / deserialization primitives for interacting with
 * the relayer API.
 *
 * Note that all streaming operations are handled by the Account class. That is,
 * the dynamic Account class manages static Wallets.
 */
import keccak256 from "keccak256";
import * as uuid from "uuid";

import Keychain from "./keychain";
import { BalanceId, FeeId, OrderId, Token, WalletId } from "./types";

function generateId(data: Buffer): uuid {
  const dataHash = new Uint8Array(keccak256(data));
  return uuid.v4({ random: dataHash.slice(-16) });
}

export class Balance {
  public readonly balanceId: BalanceId;
  constructor(public readonly mint: Token, public readonly amount: bigint) {
    this.balanceId = generateId(
      Buffer.concat([
        Buffer.from(mint.address),
        Buffer.from(amount.toString()),
      ]),
    );
  }
}

export class Order {
  public readonly orderId: OrderId;
  constructor(
    public readonly baseToken: Token,
    public readonly quoteToken: Token,
    public readonly side: "buy" | "sell",
    public readonly type: "midpoint" | "limit",
    public readonly amount: bigint,
    public readonly price?: bigint,
  ) {
    // this.orderId = generateId(Buffer.concat([
    //   Buffer.from(baseToken.address),
    //   Buffer.from(quoteToken.address),
    // ]));
  }
}

export class Fee {
  public readonly feeId: FeeId;
  constructor(
    public readonly pkSettle: bigint,
    public readonly gasMint: Token,
    public readonly gasAmount: bigint,
    public readonly percentFee: number,
  ) {
    // this.feeId = generateId()
  }
}

export class Wallet {
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
