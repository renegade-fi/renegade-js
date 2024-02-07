/* tslint:disable */
/* eslint-disable */
/**
* Computes the Poseidon2 hash of the input string and returns a BigInt.
*
* Note: Ensure the input is within the field of the BN254 curve and is a BigInt formatted as a hex string.
* @param {string} value
* @returns {bigint}
*/
export function compute_poseidon_hash(value: string): bigint;
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
