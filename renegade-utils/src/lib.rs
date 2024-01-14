use crate::custom_serde::BytesSerializable;
use base64::engine::{general_purpose as b64_general_purpose, Engine};
use helpers::{
    _compute_poseidon_hash, biguint_from_hex_string, compute_shares_commitment,
    compute_total_wallet_shares, deserialize_wallet, get_match_key, get_root_key,
    point_coord_to_string,
};
use k256::{
    ecdsa::{signature::Signer, Signature},
    elliptic_curve::sec1::ToEncodedPoint,
};
use types::ScalarField;
use wasm_bindgen::prelude::*;

const SIG_VALIDITY_WINDOW_MS: u64 = 10_000; // 10 seconds

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "bigint")]
    pub type BigInt;
}

pub mod custom_serde;
pub mod helpers;
pub mod types;

#[wasm_bindgen]
//     generate_statement_sig
pub fn generate_wallet_update_signature(wallet_str: &str, sk_root: &str) -> JsValue {
    let wallet = deserialize_wallet(wallet_str);
    let total_shares = compute_total_wallet_shares(wallet);
    let shares_commitment = compute_shares_commitment(&total_shares);

    let (signing_key, _) = get_root_key(sk_root);

    // TODO: How to convert Vec<ScalarField> to Vec<u8>?
    let sig: Signature = signing_key.sign(&shares_commitment.serialize_to_bytes());
    let sig_bytes = sig.to_bytes().to_vec();
    JsValue::from_str(&hex::encode(sig_bytes))
}

/// Computes the Poseidon2 hash of the input string and returns a BigInt.
///
/// Note: Ensure the input is within the field of the BN254 curve and is a BigInt formatted as a hex string.
#[wasm_bindgen]
pub fn compute_poseidon_hash(value: &str) -> BigInt {
    let input = [ScalarField::from(biguint_from_hex_string(value))];
    let res = _compute_poseidon_hash(&input);

    // Convert the hash result to a JavaScript BigInt
    let js_bigint: JsValue = res.to_string().into();
    js_bigint.unchecked_into::<BigInt>()
}

/// Get the shares of the key hierarchy computed from `sk_root`
///
/// # Arguments
///
/// * `sk_root` - The root key to compute the hierarchy from.
///
/// # Returns
/// * String representation of the shares of the key hierarchy.
#[wasm_bindgen]
pub fn get_key_hierarchy_shares(sk_root: &str) -> Vec<JsValue> {
    let (signing_key, verifying_key) = get_root_key(sk_root);

    let encoded_key = verifying_key
        .as_affine()
        .to_encoded_point(false /* compress */);
    let x_coord = point_coord_to_string(encoded_key.x().unwrap());
    let y_coord = point_coord_to_string(encoded_key.y().unwrap());

    let (_, pk_match) = get_match_key(signing_key);

    vec![
        JsValue::from_str(x_coord[0].as_str()),
        JsValue::from_str(x_coord[1].as_str()),
        JsValue::from_str(y_coord[0].as_str()),
        JsValue::from_str(y_coord[1].as_str()),
        JsValue::from_str(&pk_match.key.to_string()),
    ]
}

/// Get the string representation of the key hierarchy computed from `sk_root`
///
/// # Arguments
///
/// * `sk_root` - The root key to compute the hierarchy from.
///
/// # Returns
/// * String representation of the key hierarchy.
#[wasm_bindgen]
pub fn get_key_hierarchy(sk_root: &str) -> JsValue {
    let (signing_key, verifying_key) = get_root_key(sk_root);
    let (sk_match, pk_match) = get_match_key(signing_key.clone());
    let key_hierarchy = format!(
        r#"{{"public_keys":{{"pk_root":"0x{}","pk_match":"0x{}"}},"private_keys":{{"sk_root":"0x{}","sk_match":"0x{}"}}}}"#,
        hex::encode(verifying_key.to_encoded_point(false).as_bytes()), // pk_root
        pk_match.serialize_to_hex(),                                   // pk_match
        hex::encode(signing_key.to_bytes()),                           // sk_root
        sk_match.serialize_to_hex()                                    // sk_match
    );

    JsValue::from_str(&key_hierarchy)
}

/// Sign the body of a request with `sk_root`
///
/// # Arguments
///
/// * `message` - The message to be signed.
/// * `expiration` - The expiration time of the signature TODO
/// * `key` - Hex representatino of the key to sign the message with.
///
/// # Returns
///
/// * A vector of JavaScript values. The first element is the signature header,
///   and the second element is the expiration time of the signature.
#[wasm_bindgen]
pub fn sign_http_request(message: &str, timestamp: u64, key: &str) -> Vec<JsValue> {
    let message_bytes = message.as_bytes();
    let expiration = timestamp + SIG_VALIDITY_WINDOW_MS;
    let payload = [message_bytes, &expiration.to_le_bytes()].concat();

    let (signing_key, _) = get_root_key(key);
    let sig: Signature = signing_key.sign(&payload);
    let sig_bytes = sig.to_bytes().to_vec();
    let sig_header = b64_general_purpose::STANDARD_NO_PAD.encode(sig_bytes);

    vec![
        JsValue::from_str(&sig_header),
        JsValue::from_str(&expiration.to_string()),
    ]
}

/// Sign a message with a given key
///
/// # Arguments
///
/// * `message` - The message to be signed.
/// * `key` - The key to sign the message with.
///
/// # Returns
///
/// * A `JsValue` containing the hexadecimal string representation of the signature.
#[wasm_bindgen]
pub fn sign_message(message: &str, key: &str) -> JsValue {
    let message_bytes = message.as_bytes();

    let (signing_key, _) = get_root_key(key);
    let sig: Signature = signing_key.sign(&message_bytes);
    let sig_hex = hex::encode(sig.to_bytes());

    JsValue::from_str(&sig_hex)
}

/// Get the verifying key from a signing key
///
/// # Arguments
///
/// * `key` - Hex representation of the signing key.
///
/// # Returns
///
/// * A `JsValue` containing the hexadecimal string representation of the verifying key.
#[wasm_bindgen]
pub fn get_verifying_key(key: &str) -> JsValue {
    let (_, verifying_key) = get_root_key(key);
    let verifying_key_hex = hex::encode(verifying_key.to_encoded_point(false).as_bytes());

    JsValue::from_str(&verifying_key_hex)
}

#[wasm_bindgen]
pub fn hex_to_b64(hex: &str) -> JsValue {
    let bytes = hex::decode(hex).unwrap();
    let b64 = b64_general_purpose::STANDARD_NO_PAD.encode(bytes);

    JsValue::from_str(&b64)
}

#[cfg(test)]
mod tests {}
