/* tslint:disable */
/* eslint-disable */
/**
* @param {string} msg
* @returns {any}
*/
export function derive_signing_key_from_signature(msg: string): any;
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
* Get the shares of the managing key cluster given the hex representation of the key.
*
* # Arguments
*
* * `managing_cluster_key` - The managing cluster key to compute the shares from.
*
* # Returns
* * A vector of JavaScript values. The first element is the x coordinate of the key, and the second element is the y coordinate of the key, in decimal.
* @param {string} managing_cluster_key
* @returns {any[]}
*/
export function get_managing_cluster_shares(managing_cluster_key: string): any[];
/**
* Ensures a value fits within the base field.
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
* Generates wallet update statement signature.
*
* # Arguments
*
* * `wallet_str` - Serialized wallet data.
* * `sk_root` - sk_root in hex.
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
* Generates external transfer signature for withdrawals.
*
* # Arguments
*
* * `external_transfer_str` - Serialized external transfer data.
* * `sk_root` - sk_root in hex.
*
* # Returns
*
* A `JsValue` containing the hex-encoded signature string.
* @param {string} external_transfer_str
* @param {string} sk_root
* @returns {any}
*/
export function generate_external_transfer_signature(external_transfer_str: string, sk_root: string): any;
/**
* Generates authorization headers for HTTP requests to a relayer.
*
* # Arguments
*
* * `message` - The message to be signed.
* * `timestamp` - The current timestamp.
* * `sk_root` - sk_root in hex.
*
* # Returns
*
* * A vector of JavaScript values. The first element is the signature header,
*   and the second element is the expiration time of the signature.
* @param {string} message
* @param {bigint} timestamp
* @param {string} sk_root
* @returns {any[]}
*/
export function sign_http_request(message: string, timestamp: bigint, sk_root: string): any[];
/**
* Sign a message with sk_root
*
* # Arguments
*
* * `message` - The message to be signed.
* * `sk_root` - sk_root in hex.
*
* # Returns
*
* * A `JsValue` containing the hexadecimal string representation of the signature.
* @param {string} message
* @param {string} sk_root
* @returns {any}
*/
export function sign_message(message: string, sk_root: string): any;
