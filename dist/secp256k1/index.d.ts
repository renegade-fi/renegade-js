/* tslint:disable */
/* eslint-disable */
/**
* Get the verifying key from a signing key
*
* # Arguments
*
* * `key` - Hex representation of the signing key.
*
* # Returns
*
* * A `JsValue` containing the hexadecimal string representation of the verifying key.
* @param {string} key
* @returns {any}
*/
export function get_verifying_key(key: string): any;
/**
* Sign a message with a given key
*
* # Arguments
*
* * `message` - The message to be signed. raw string (JSON.stringify)
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
/**
* Sign the body of a request with `sk_root`
*
* # Arguments
*
* * `message` - Hex representation of the message to be signed
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
* @param {string} hex
* @returns {any}
*/
export function hex_to_b64(hex: string): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly get_verifying_key: (a: number, b: number) => number;
  readonly sign_message: (a: number, b: number, c: number, d: number) => number;
  readonly sign_http_request: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly hex_to_b64: (a: number, b: number) => number;
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
