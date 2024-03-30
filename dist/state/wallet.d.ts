import { WalletId } from "../types";
import Balance from "./balance";
import Keychain from "./keychain";
import Order from "./order";
export declare const MAX_BALANCES = 5;
export declare const MAX_ORDERS = 5;
export default class Wallet {
    readonly walletId: WalletId;
    readonly balances: Balance[];
    readonly orders: Order[];
    readonly keychain: Keychain;
    readonly blinder: bigint;
    readonly publicBlinder: bigint;
    readonly privateBlinder: bigint;
    readonly blindedPublicShares: bigint[];
    readonly privateShares: bigint[];
    readonly managingCluster: string;
    readonly matchFee: number;
    constructor(params: {
        id?: WalletId;
        balances: Balance[];
        orders: Order[];
        keychain: Keychain;
        blinder: bigint;
        publicBlinder?: bigint;
        privateBlinder?: bigint;
        blindedPublicShares?: bigint[];
        privateShares?: bigint[];
        exists?: boolean;
        managingCluster?: string;
        matchFee?: number;
    });
    static getBlindersFromShares(privateShares: bigint[], publicShares: bigint[]): [bigint, bigint, bigint];
    getBlinders(): [bigint, bigint, bigint];
    packBalances(): bigint[];
    packOrders(): bigint[];
    packMatchFee(): bigint[];
    packManagingCluster(): bigint[];
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
    reblind(): Wallet;
    serialize(): string;
    static deserialize(serializedWallet: any): Wallet;
}
