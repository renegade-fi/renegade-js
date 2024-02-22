import { add, compute_poseidon_hash, hex_to_field_scalar, subtract, } from "../../renegade-utils";
export function toFieldScalar(value) {
    const hexString = value.toString(16);
    const fieldScalarString = hex_to_field_scalar(hexString);
    return BigInt(fieldScalarString);
}
export function addFF(a, b) {
    const hexA = a.toString(16);
    const hexB = b.toString(16);
    const sumString = add(hexA, hexB);
    return BigInt(sumString);
}
export function subtractFF(a, b) {
    const hexA = a.toString(16);
    const hexB = b.toString(16);
    const differenceString = subtract(hexA, hexB);
    return BigInt(differenceString);
}
export function computePoseidonHash(input) {
    const hexInput = input.toString(16);
    const hash = compute_poseidon_hash(hexInput);
    return BigInt(hash);
}
