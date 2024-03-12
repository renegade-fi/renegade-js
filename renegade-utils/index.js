let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder, TextEncoder } = require(`util`);

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}
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
module.exports.get_managing_cluster_shares = function(managing_cluster_key) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(managing_cluster_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.get_managing_cluster_shares(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v2 = getArrayJsValueFromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 4, 4);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

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
module.exports.hex_to_field_scalar = function(value) {
    const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.hex_to_field_scalar(ptr0, len0);
    return takeObject(ret);
};

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
module.exports.bigint_to_limbs = function(value) {
    const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.bigint_to_limbs(ptr0, len0);
    return takeObject(ret);
};

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
module.exports.add = function(a, b) {
    const ptr0 = passStringToWasm0(a, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(b, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.add(ptr0, len0, ptr1, len1);
    return takeObject(ret);
};

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
module.exports.subtract = function(a, b) {
    const ptr0 = passStringToWasm0(a, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(b, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.subtract(ptr0, len0, ptr1, len1);
    return takeObject(ret);
};

/**
* Computes the Poseidon2 hash of the input string and returns a BigInt as a string.
*
* Note: Ensure the input is within the field of the BN254 curve and is a BigInt formatted as a hex string.
* @param {string} value
* @returns {any}
*/
module.exports.compute_poseidon_hash = function(value) {
    const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.compute_poseidon_hash(ptr0, len0);
    return takeObject(ret);
};

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
module.exports.generate_wallet_update_signature = function(wallet_str, sk_root) {
    const ptr0 = passStringToWasm0(wallet_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(sk_root, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.generate_wallet_update_signature(ptr0, len0, ptr1, len1);
    return takeObject(ret);
};

/**
* @param {string} external_transfer_str
* @param {string} sk_root
* @returns {any}
*/
module.exports.generate_external_transfer_signature = function(external_transfer_str, sk_root) {
    const ptr0 = passStringToWasm0(external_transfer_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(sk_root, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.generate_external_transfer_signature(ptr0, len0, ptr1, len1);
    return takeObject(ret);
};

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
module.exports.get_key_hierarchy_shares = function(sk_root) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(sk_root, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.get_key_hierarchy_shares(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v2 = getArrayJsValueFromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 4, 4);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

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
module.exports.get_key_hierarchy = function(sk_root) {
    const ptr0 = passStringToWasm0(sk_root, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.get_key_hierarchy(ptr0, len0);
    return takeObject(ret);
};

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
module.exports.get_shares_commitment = function(wallet_str) {
    const ptr0 = passStringToWasm0(wallet_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.get_shares_commitment(ptr0, len0);
    return takeObject(ret);
};

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
module.exports.sign_http_request = function(message, timestamp, key) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.sign_http_request(retptr, ptr0, len0, timestamp, ptr1, len1);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v3 = getArrayJsValueFromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 4, 4);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

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
module.exports.sign_message = function(message, key) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.sign_message(ptr0, len0, ptr1, len1);
    return takeObject(ret);
};

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

const path = require('path').join(__dirname, 'index_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

