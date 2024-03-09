import { get_key_hierarchy_shares, get_managing_cluster_shares, } from "../../renegade-utils";
import { addFF, subtractFF } from "../utils/field";
import Balance from "./balance";
import Keychain from "./keychain";
import Order from "./order";
import { bigIntToLimbsLE, createWalletSharesWithRandomness, evaluateHashChain, generateId, limbsToBigIntLE, } from "./utils";
// The maximum number of balances, orders, and fees that can be stored in a wallet
const MAX_BALANCES = 5;
export const MAX_ORDERS = 5;
const MAX_FEES = 0;
// Number of secret shares to represent each of balances, orders, and fees
const SHARES_PER_BALANCE = 4;
const SHARES_PER_ORDER = 5;
const SHARES_PER_FEE = 0;
const SHARES_PER_MATCH_FEE = 1;
const SHARES_PER_MANAGING_CLUSTER = 2;
// The number of felt words to represent pk_root
// Stored as the affine coordinates of the point
const NUM_ROOT_KEY_WORDS = 4;
// The number of shares to represent the keychain. Equal to the number of shares
// to represent pk_root, plus one for pk_match
const SHARES_PER_KEYCHAIN = NUM_ROOT_KEY_WORDS + 1;
const SHARES_PER_BLINDER = 1;
// The total number of shares per wallet
const SHARES_PER_WALLET = MAX_BALANCES * SHARES_PER_BALANCE +
    MAX_ORDERS * SHARES_PER_ORDER +
    SHARES_PER_MATCH_FEE +
    SHARES_PER_MANAGING_CLUSTER +
    SHARES_PER_KEYCHAIN +
    SHARES_PER_BLINDER;
export default class Wallet {
    walletId;
    balances;
    orders;
    fees;
    keychain;
    blinder;
    publicBlinder;
    privateBlinder;
    blindedPublicShares;
    privateShares;
    managingCluster;
    matchFee;
    constructor(params) {
        this.walletId =
            params.id || generateId(params.keychain.keyHierarchy.root.secretKey);
        this.balances = params.balances;
        this.orders = params.orders;
        this.fees = params.fees;
        this.keychain = params.keychain;
        this.blinder = params.blinder;
        this.publicBlinder = params.publicBlinder || 0n;
        this.privateBlinder = params.privateBlinder || 0n;
        this.blindedPublicShares = params.blindedPublicShares || [];
        this.privateShares = params.privateShares || [];
        this.managingCluster = params.managingCluster || "0x0";
        this.matchFee = params.matchFee || 0.0;
        if (!params.exists) {
            [this.blinder, this.privateBlinder, this.publicBlinder] =
                this.getBlinders();
            [this.blindedPublicShares, this.privateShares] = this.deriveShares();
        }
    }
    static getBlindersFromShares(privateShares, publicShares) {
        const blinderPrivateShare = privateShares[privateShares.length - 1];
        const blinderPublicShare = publicShares[publicShares.length - 1];
        const blinder = addFF(blinderPrivateShare, blinderPublicShare);
        return [blinder, blinderPrivateShare, blinderPublicShare];
    }
    getBlinders() {
        // TODO: Generate blinder seed from Ethereum private key signature
        const blinderSeed = BigInt(`0x${this.keychain.keyHierarchy.root.secretKey}`) + 1n;
        const [blinder, blinderPrivateShare] = evaluateHashChain(blinderSeed, 2);
        const blinderPublicShare = subtractFF(blinder, blinderPrivateShare);
        return [blinder, blinderPrivateShare, blinderPublicShare];
    }
    packBalances() {
        const packedBalances = this.balances.map((balance) => balance.pack());
        const packedPadding = Array(MAX_BALANCES - this.balances.length).fill(Array(SHARES_PER_BALANCE).fill(0n));
        return packedBalances.flat().concat(packedPadding.flat());
    }
    packOrders() {
        const packedOrders = this.orders.map((order) => order.pack());
        const packedPadding = Array(MAX_ORDERS - this.orders.length).fill(Array(SHARES_PER_ORDER).fill(0n));
        const res = packedOrders.flat().concat(packedPadding.flat());
        return res;
    }
    packMatchFee() {
        return [BigInt(Math.floor(this.matchFee * 2 ** 32 || 0))];
    }
    packManagingCluster() {
        if (this.managingCluster === "0x0") {
            return Array(SHARES_PER_MANAGING_CLUSTER).fill(0n);
        }
        const shares = get_managing_cluster_shares(this.managingCluster);
        return shares.map((share) => BigInt(share));
    }
    packFees() {
        const packedFees = this.fees.map((fee) => fee.pack());
        const packedPadding = Array(MAX_FEES - this.fees.length).fill(Array(SHARES_PER_FEE).fill(0n));
        return packedFees.flat().concat(packedPadding.flat());
    }
    packKeychain() {
        return get_key_hierarchy_shares(this.keychain.keyHierarchy.root.secretKey).map((share) => BigInt(share));
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
            .concat(this.packKeychain())
            .concat(this.packMatchFee())
            .concat(this.packManagingCluster())
            .concat(this.packBlinder());
    }
    /**
     * Derive blinded public shares and private shares for the wallet.
     */
    deriveShares() {
        // TODO: Generate seed from Ethereuem private key signature
        const shareStreamSeed = BigInt(`0x${this.keychain.keyHierarchy.root.secretKey}`) + 2n;
        const secretShares = evaluateHashChain(shareStreamSeed, SHARES_PER_WALLET);
        const [privateShares, blindedPublicShares] = createWalletSharesWithRandomness(this.packWallet(), this.blinder, this.privateBlinder, secretShares);
        if (blindedPublicShares.length !== SHARES_PER_WALLET ||
            privateShares.length !== SHARES_PER_WALLET) {
            throw new Error("Invalid number of shares generated");
        }
        return [blindedPublicShares, privateShares];
    }
    // Reblind the wallet, consuming the next set of blinders and secret shares
    // Ensure that wallet is latest from relayer
    reblind() {
        const privateShares = this.privateShares;
        const [newBlinder, newBlinderPrivateShare] = evaluateHashChain(privateShares[SHARES_PER_WALLET - 1], 2);
        const secretShares = evaluateHashChain(privateShares[SHARES_PER_WALLET - 2], SHARES_PER_WALLET);
        const [newPrivateShares, newPublicShares] = createWalletSharesWithRandomness(this.packWallet(), newBlinder, newBlinderPrivateShare, secretShares);
        return new Wallet({
            id: this.walletId,
            balances: this.balances,
            orders: this.orders,
            fees: this.fees,
            keychain: this.keychain,
            blinder: newBlinder,
            privateBlinder: newBlinderPrivateShare,
            publicBlinder: subtractFF(newBlinder, newBlinderPrivateShare),
            blindedPublicShares: newPublicShares,
            privateShares: newPrivateShares,
            exists: true,
            managingCluster: this.managingCluster,
            matchFee: this.matchFee,
        });
    }
    serialize() {
        const serializedBlindedPublicShares = this.blindedPublicShares.map((share) => "[" + bigIntToLimbsLE(share).join(",") + "]");
        const serializedPrivateShares = this.privateShares.map((share) => "[" + bigIntToLimbsLE(share).join(",") + "]");
        return `{
      "id": "${this.walletId}",
      "balances": [${this.balances.map((b) => b.serialize()).join(",")}],
      "orders": [${this.orders.map((o) => o.serialize()).join(",")}],
      "fees": [${this.fees.map((f) => f.serialize()).join(",")}],
      "key_chain": ${this.keychain.serialize()},
      "managing_cluster": "${this.managingCluster}",
      "match_fee": ${this.matchFee},
      "blinder": [${bigIntToLimbsLE(this.blinder).join(",")}],
      "blinded_public_shares": [${serializedBlindedPublicShares.join(",")}],
      "private_shares": [${serializedPrivateShares.join(",")}],
      "update_locked": false
    }`.replace(/[\s\n]/g, "");
    }
    static deserialize(serializedWallet) {
        // console.log(
        //   "[SDK] Wallet.deserialize: serializedWallet: ",
        //   serializedWallet,
        // );
        const id = serializedWallet.id;
        const balances = serializedWallet.balances.map((b) => Balance.deserialize(b));
        const orders = serializedWallet.orders.map((o) => Order.deserialize(o));
        const fees = [];
        const keychain = Keychain.deserialize(serializedWallet.key_chain);
        const updateLocked = serializedWallet.update_locked;
        const blindedPublicShares = serializedWallet.blinded_public_shares.map((share) => {
            return limbsToBigIntLE(share);
        });
        const privateShares = serializedWallet.private_shares.map((share) => {
            return limbsToBigIntLE(share);
        });
        const [derivedBlinder, privateBlinder, publicBlinder] = Wallet.getBlindersFromShares(privateShares, blindedPublicShares);
        return new Wallet({
            id,
            balances,
            orders,
            fees,
            keychain,
            blinder: derivedBlinder,
            publicBlinder,
            privateBlinder,
            blindedPublicShares,
            privateShares,
            updateLocked,
            exists: true,
            matchFee: serializedWallet.match_fee,
            managingCluster: serializedWallet.managing_cluster,
        });
    }
}
