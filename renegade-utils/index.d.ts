/* tslint:disable */
/* eslint-disable */
/**
* Converts a bigint hex string to a scalar within the prime field's order and returns a BigInt as a string.
*
* # Arguments
*
* * `value` - A string representing the bigint in hex form.
*
* # Returns
*
* A `JsValue` containing the bigint within the prime field's order as a string.
* @param {string} value
* @returns {any}
*/
export function hex_to_field_scalar(value: string): any;
/**
* Converts a hexadecimal string representation of a bigint into its limbs representation and returns it as a `JsValue`.
*
* # Arguments
*
* * `value` - A string slice that holds the hexadecimal representation of the bigint.
*
* # Returns
*
* A `JsValue` containing the JSON string representation of the bigint's limbs.
* @param {string} value
* @returns {any}
*/
export function bigint_to_limbs(value: string): any;
/**
* Adds two numbers in the prime field and returns the result as a string. Inputs are hex strings.
*
* # Arguments
*
* * `a` - A string representing the first number in hex form.
* * `b` - A string representing the second number in hex form.
*
* # Returns
*
* A `JsValue` containing the decimal string representation of the result.
* @param {string} a
* @param {string} b
* @returns {any}
*/
export function add(a: string, b: string): any;
/**
* Subtracts the second number from the first in the prime field and returns the result as a string. Inputs are hex strings.
*
* # Arguments
*
* * `a` - A string representing the first number in hex form.
* * `b` - A string representing the second number in hex form to subtract from the first.
*
* # Returns
*
* A `JsValue` containing the decimal string representation of the result.
* @param {string} a
* @param {string} b
* @returns {any}
*/
export function subtract(a: string, b: string): any;
/**
* Computes the Poseidon2 hash of the input string and returns a BigInt as a string.
*
* Note: Ensure the input is within the field of the BN254 curve and is a BigInt formatted as a hex string.
* @param {string} value
* @returns {any}
*/
export function compute_poseidon_hash(value: string): any;
/**
* Generates a signature for a wallet update operation.
*
* This function takes a serialized wallet and the root secret key as inputs,
* generates a signature for the wallet update, and returns the signature as a hex-encoded string.
*
* # Arguments
*
* * `wallet_str` - A string slice that holds the serialized wallet data.
* * `sk_root` - A string slice that holds the root secret key.
*
* # Returns
*
* A `JsValue` containing the hex-encoded signature string.
* @param {string} wallet_str
* @param {string} sk_root
* @returns {any}
*/
export function generate_wallet_update_signature(wallet_str: string, sk_root: string): any;
/**
* Get the shares of the key hierarchy computed from `sk_root`
*
* # Arguments
*
* * `sk_root` - The root key to compute the hierarchy from.
*
* # Returns
* * String representation of the shares of the key hierarchy.
* @param {string} sk_root
* @returns {any[]}
*/
export function get_key_hierarchy_shares(sk_root: string): any[];
/**
* Get the string representation of the key hierarchy computed from `sk_root`
*
* # Arguments
*
* * `sk_root` - The root key to compute the hierarchy from.
*
* # Returns
* * String representation of the key hierarchy.
* @param {string} sk_root
* @returns {any}
*/
export function get_key_hierarchy(sk_root: string): any;
/**
* Generates a signature for updating a wallet by hashing the wallet's share commitments
* and using the provided signing key to sign the hash.
*
* # Arguments
*
* * `wallet` - The `Wallet` instance containing the share commitments to be signed.
* * `signing_key` - A reference to the `SigningKey` used to sign the hash of the commitments.
*
* # Returns
*
* * A `Signature` object representing the ECDSA signature of the hashed commitments.
* @param {string} wallet_str
* @returns {any}
*/
export function get_shares_commitment(wallet_str: string): any;
/**
* Sign the body of a request with `sk_root`
*
* # Arguments
*
* * `message` - The message to be signed.
* * `expiration` - The expiration time of the signature TODO
* * `key` - Hex representatino of the key to sign the message with.
*
* # Returns
*
* * A vector of JavaScript values. The first element is the signature header,
*   and the second element is the expiration time of the signature.
* @param {string} message
* @param {bigint} timestamp
* @param {string} key
* @returns {any[]}
*/
export function sign_http_request(message: string, timestamp: bigint, key: string): any[];
/**
* Sign a message with a given key
*
* # Arguments
*
* * `message` - The message to be signed.
* * `key` - The key to sign the message with.
*
* # Returns
*
* * A `JsValue` containing the hexadecimal string representation of the signature.
* @param {string} message
* @param {string} key
* @returns {any}
*/
export function sign_message(message: string, key: string): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly hex_to_field_scalar: (a: number, b: number) => number;
  readonly bigint_to_limbs: (a: number, b: number) => number;
  readonly add: (a: number, b: number, c: number, d: number) => number;
  readonly subtract: (a: number, b: number, c: number, d: number) => number;
  readonly compute_poseidon_hash: (a: number, b: number) => number;
  readonly generate_wallet_update_signature: (a: number, b: number, c: number, d: number) => number;
  readonly get_key_hierarchy_shares: (a: number, b: number, c: number) => void;
  readonly get_key_hierarchy: (a: number, b: number) => number;
  readonly get_shares_commitment: (a: number, b: number) => number;
  readonly sign_http_request: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly sign_message: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
