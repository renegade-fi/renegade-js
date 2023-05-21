import keccak256 from "keccak256";
import * as uuid from "uuid";
export const RENEGADE_AUTH_HEADER = "renegade-auth";
export const RENEGADE_AUTH_EXPIRATION_HEADER = "renegade-auth-expiration";
export function generateId(data) {
    const dataHash = new Uint8Array(keccak256(data));
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
