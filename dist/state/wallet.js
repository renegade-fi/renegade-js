import Balance from "./balance";
import Fee from "./fee";
import Keychain from "./keychain";
import Order from "./order";
import { bigIntToLimbsLE, generateId, limbsToBigIntLE } from "./utils";
// The maximum number of balances, orders, and fees that can be stored in a wallet
const MAX_BALANCES = 5;
const MAX_ORDERS = 5;
const MAX_FEES = 2;
// Number of secret shares to represent each of balances, orders, and fees
const SHARES_PER_BALANCE = 2;
const SHARES_PER_ORDER = 6;
const SHARES_PER_FEE = 4;
// The number of felt words to represent pk_root
const NUM_ROOT_KEY_WORDS = 2;
// The number of shares to represent the keychain. Equal to the number of shares
// to represent pk_root, plus one for pk_match
const SHARES_PER_KEYCHAIN = NUM_ROOT_KEY_WORDS + 1;
// The total number of shares per wallet
const SHARES_PER_WALLET = MAX_BALANCES * SHARES_PER_BALANCE +
    MAX_ORDERS * SHARES_PER_ORDER +
    MAX_FEES * SHARES_PER_FEE +
    SHARES_PER_KEYCHAIN +
    1;
export default class Wallet {
    constructor(params) {
        this.walletId =
            params.id ||
                generateId(Buffer.from(params.keychain.keyHierarchy.root.publicKey.buffer));
        this.balances = params.balances;
        this.orders = params.orders;
        this.fees = params.fees;
        this.keychain = params.keychain;
        this.blinder = 0n; // params.blinder;
        [this.blindedPublicShares, this.privateShares] = this.deriveShares();
    }
    packBalances() {
        const packedBalances = this.balances.map((balance) => balance.pack());
        const packedPadding = Array(MAX_BALANCES - this.balances.length).fill(Array(SHARES_PER_BALANCE).fill(0n));
        return packedBalances.flat().concat(packedPadding.flat());
    }
    packOrders() {
        const packedOrders = this.orders.map((order) => order.pack());
        const packedPadding = Array(MAX_ORDERS - this.orders.length).fill(Array(SHARES_PER_ORDER).fill(0n));
        return packedOrders.flat().concat(packedPadding.flat());
    }
    packFees() {
        const packedFees = this.fees.map((fee) => fee.pack());
        const packedPadding = Array(MAX_FEES - this.fees.length).fill(Array(SHARES_PER_FEE).fill(0n));
        return packedFees.flat().concat(packedPadding.flat());
    }
    packKeychain() {
        const pkRoot = BigInt("0x" +
            Buffer.from(this.keychain.keyHierarchy.root.publicKey)
                .reverse()
                .toString("hex"));
        const pkMatch = BigInt("0x" +
            Buffer.from(this.keychain.keyHierarchy.match.publicKey)
                .reverse()
                .toString("hex"));
        const packedPkRoot = [pkRoot % 2n ** 248n, (pkRoot >> 248n) % 2n ** 248n];
        const packedPkMatch = [pkMatch];
        return packedPkRoot.concat(packedPkMatch);
    }
    packBlinder() {
        return [this.blinder];
    }
    /**
     * Generated the "packed" form of this wallet by concatenating the packed
     * forms of each of its components.
     */
    packWallet() {
        return this.packBalances()
            .concat(this.packOrders())
            .concat(this.packFees())
            .concat(this.packKeychain())
            .concat(this.packBlinder());
    }
    /**
     * Derive blinded public shares and private shares for the wallet.
     */
    deriveShares() {
        const packedWallet = this.packWallet();
        const publicShares = packedWallet;
        const privateShares = Array(packedWallet.length).fill(0n);
        const blindedPublicShares = publicShares;
        if (blindedPublicShares.length !== SHARES_PER_WALLET ||
            privateShares.length !== SHARES_PER_WALLET) {
            throw new Error("Invalid number of shares generated");
        }
        return [blindedPublicShares, privateShares];
    }
    serialize(asBigEndian) {
        const serializedBlindedPublicShares = this.blindedPublicShares.map((share) => "[" + bigIntToLimbsLE(share).join(",") + "]");
        const serializedPrivateShares = this.privateShares.map((share) => "[" + bigIntToLimbsLE(share).join(",") + "]");
        return `{
      "id": "${this.walletId}",
      "balances": [${this.balances.map((b) => b.serialize()).join(",")}],
      "orders": [${this.orders.map((o) => o.serialize()).join(",")}],
      "fees": [${this.fees.map((f) => f.serialize()).join(",")}],
      "key_chain": ${this.keychain.serialize(asBigEndian)},
      "blinder": [${bigIntToLimbsLE(this.blinder).join(",")}],
      "blinded_public_shares": [${serializedBlindedPublicShares.join(",")}],
      "private_shares": [${serializedPrivateShares.join(",")}]
    }`.replace(/[\s\n]/g, "");
    }
    static deserialize(serializedWallet, asBigEndian) {
        const id = serializedWallet.id;
        const balances = serializedWallet.balances.map((b) => Balance.deserialize(b));
        const orders = serializedWallet.orders.map((o) => Order.deserialize(o));
        const fees = serializedWallet.fees.map((f) => Fee.deserialize(f));
        const keychain = Keychain.deserialize(serializedWallet.key_chain, asBigEndian);
        const blinder = limbsToBigIntLE(serializedWallet.blinder);
        return new Wallet({ id, balances, orders, fees, keychain, blinder });
    }
}
