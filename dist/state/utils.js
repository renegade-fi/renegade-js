import { sha256 } from "@noble/hashes/sha256";
import * as uuid from "uuid";
import { compute_poseidon_hash } from "../../dist/renegade-utils";
import { F } from "../utils/field";
export const RENEGADE_AUTH_HEADER = "renegade-auth";
export const RENEGADE_AUTH_EXPIRATION_HEADER = "renegade-auth-expiration";
export function generateId(data) {
    const dataHash = sha256(data);
    return uuid.v4({ random: dataHash.slice(-16) });
}
export function bigIntToLimbsLE(number, bitsPerLimb, numLimbs) {
    bitsPerLimb = bitsPerLimb || 32;
    numLimbs = numLimbs || 8;
    if (number < 0n || number >= 2n ** BigInt(bitsPerLimb * numLimbs)) {
        throw new Error("Invalid conversion of bigint to limbs: " + number);
    }
    const limbs = [];
    for (let i = 0; i < numLimbs; i++) {
        limbs.push((number >> BigInt(i * bitsPerLimb)) % 2n ** BigInt(bitsPerLimb));
    }
    return limbs;
}
export function limbsToBigIntLE(limbs, bitsPerLimb) {
    bitsPerLimb = bitsPerLimb || 32;
    let number = 0n;
    for (let i = 0; i < limbs.length; i++) {
        number += BigInt(limbs[i]) * 2n ** BigInt(i * bitsPerLimb);
    }
    return number;
}
const SCALAR_MOD = F.p;
export function splitBigIntIntoWords(number, SCALAR_WORDS = 2) {
    const res = [];
    for (let i = 0; i < SCALAR_WORDS; i++) {
        const word = number % SCALAR_MOD;
        number /= SCALAR_MOD;
        res.push(word);
    }
    return res;
}
// TODO
export function combineWordsIntoBigInt(words) {
    let res = 0n;
    for (let i = words.length - 1; i >= 0; i--) {
        res *= SCALAR_MOD;
        res += words[i];
    }
    return res;
}
/**
 * Convert a bigint to a Uint8Array
 */
export function bigIntToUint8Array(number) {
    return new Uint8Array(Buffer.from(number.toString(16), "hex")).reverse();
}
/**
 * Convert a Uint8Array to a bigint
 */
export function uint8ArrayToBigInt(buf) {
    return BigInt("0x" + Buffer.from(buf).toString("hex"));
}
/**
 * Compute a chained Poseidon hash of the given length from the given seed
 */
export function evaluateHashChain(seed, length) {
    seed = F.e(seed);
    const res = [];
    for (let i = 0; i < length; i++) {
        // TODO: Should not need to cast to BigInt
        seed = BigInt(compute_poseidon_hash(seed.toString(16)));
        res.push(seed);
    }
    return res;
}
/**
 * Create a secret sharing of a wallet given the secret shares and blinders
 */
export function createWalletSharesWithRandomness(walletShares, blinder, privateBlinderShare, secretShares) {
    const publicShares = walletShares.map((share) => F.e(share));
    const walletPublicShares = publicShares.map((share, i) => {
        return F.sub(share, secretShares[i]);
    });
    const privateShares = secretShares;
    const publicBlindedShares = walletPublicShares.map((share) => F.add(share, blinder));
    /// This is necessary because this implementation will blind the blinder as well as the shares, which is undesirable
    privateShares[privateShares.length - 1] = privateBlinderShare;
    publicBlindedShares[walletPublicShares.length - 1] = F.sub(blinder, privateBlinderShare);
    return [privateShares, publicBlindedShares];
}
export function findZeroOrders(orders) {
    return Object.entries(orders)
        .filter(([, order]) => order.amount === 0n)
        .map(([id]) => id);
}
