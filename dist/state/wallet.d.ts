import { WalletId } from "../types";
import Balance from "./balance";
import Fee from "./fee";
import Keychain from "./keychain";
import Order from "./order";
export default class Wallet {
    readonly walletId: WalletId;
    readonly balances: Balance[];
    readonly orders: Order[];
    readonly fees: Fee[];
    readonly keychain: Keychain;
    readonly randomness: bigint;
    constructor(params: {
        id?: WalletId;
        balances: Balance[];
        orders: Order[];
        fees: Fee[];
        keychain: Keychain;
        randomness: bigint;
    });
    serialize(asBigEndian?: boolean): string;
    static deserialize(serializedWallet: any, asBigEndian?: boolean): Wallet;
}
