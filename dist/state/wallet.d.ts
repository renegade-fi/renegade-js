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
    readonly blinder: bigint;
    readonly publicBlinder: bigint;
    readonly privateBlinder: bigint;
    readonly blindedPublicShares: bigint[];
    readonly privateShares: bigint[];
    readonly updateLocked: boolean;
    constructor(params: {
        id?: WalletId;
        balances: Balance[];
        orders: Order[];
        fees: Fee[];
        keychain: Keychain;
        blinder: bigint;
        updateLocked?: boolean;
    });
    getBlinders(): [bigint, bigint, bigint];
    packBalances(): bigint[];
    packOrders(): bigint[];
    packFees(): bigint[];
    packKeychain(): bigint[];
    packBlinder(): bigint[];
    /**
     * Generated the "packed" form of this wallet by concatenating the packed
     * forms of each of its components.
     */
    packWallet(): bigint[];
    /**
     * Derive blinded public shares and private shares for the wallet.
     */
    deriveShares(): [bigint[], bigint[]];
    serialize(asBigEndian?: boolean): string;
    static deserialize(serializedWallet: any, asBigEndian?: boolean): Wallet;
}
