import keccak256 from "keccak256";
import * as uuid from "uuid";
export const RENEGADE_AUTH_HEADER = "renegade-auth";
export const RENEGADE_AUTH_EXPIRATION_HEADER = "renegade-auth-expiration";
export function generateId(data) {
    const dataHash = new Uint8Array(keccak256(data));
    return uuid.v4({ random: dataHash.slice(-16) });
}
export function bigIntToLimbs(bigint) {
    return [
        bigint % 2n ** 32n,
        (bigint >> 32n) % 2n ** 32n,
        (bigint >> 64n) % 2n ** 32n,
        (bigint >> 96n) % 2n ** 32n,
    ];
}
export function limbsToBigInt(limbs) {
    if (limbs.length === 0) {
        return 0n;
    }
    else if (limbs.length === 1) {
        return BigInt(limbs[0]);
    }
    else if (limbs.length !== 4) {
        throw new Error(`Invalid limbs: ${limbs}`);
    }
    const limbsBigInt = limbs.map((limb) => BigInt(limb));
    return (limbsBigInt[0] +
        limbsBigInt[1] * 2n ** 32n +
        limbsBigInt[2] * 2n ** 64n +
        limbsBigInt[3] * 2n ** 96n);
}
