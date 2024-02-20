use base64::engine::{general_purpose as b64_general_purpose, Engine};
use ethers_helpers::gen_update_wallet_signature;
use helpers::{
    _compute_poseidon_hash, biguint_from_hex_string, deserialize_wallet, get_match_key,
    get_root_key, point_coord_to_string,
};
use k256::{
    ecdsa::{signature::Signer, Signature},
    elliptic_curve::sec1::ToEncodedPoint,
};
use num_bigint::BigUint;
use types::ScalarField;
use wasm_bindgen::prelude::*;

const SIG_VALIDITY_WINDOW_MS: u64 = 10_000; // 10 seconds

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "bigint")]
    pub type BigInt;
}

pub mod custom_serde;
pub mod ethers_helpers;
pub mod helpers;
pub mod types;

/// Converts a bigint hex string to a scalar within the prime field's order and returns a BigInt as a string.
///
/// # Arguments
///
/// * `value` - A string representing the bigint in hex form.
///
/// # Returns
///
/// A `JsValue` containing the bigint within the prime field's order as a string.
#[wasm_bindgen]
pub fn bigint_to_scalar_within_field(value: &str) -> JsValue {
    let bigint = biguint_from_hex_string(value);
    let scalar: ScalarField = ScalarField::from(bigint);
    let result_bigint: BigUint = scalar.into();
    JsValue::from_str(&result_bigint.to_string())
}

/// Adds two numbers in the prime field and returns the result as a string. Inputs are hex strings.
///
/// # Arguments
///
/// * `a` - A string representing the first number in hex form.
/// * `b` - A string representing the second number in hex form.
///
/// # Returns
///
/// A `JsValue` containing the decimal string representation of the result.
#[wasm_bindgen]
pub fn add_prime_field(a: &str, b: &str) -> JsValue {
    let a_scalar = ScalarField::from(biguint_from_hex_string(a));
    let b_scalar = ScalarField::from(biguint_from_hex_string(b));

    // Perform addition
    let result: ScalarField = a_scalar + b_scalar;
    let result_bigint: BigUint = result.into();
    JsValue::from_str(&result_bigint.to_string())
}

/// Subtracts the second number from the first in the prime field and returns the result as a string. Inputs are hex strings.
///
/// # Arguments
///
/// * `a` - A string representing the first number in hex form.
/// * `b` - A string representing the second number in hex form to subtract from the first.
///
/// # Returns
///
/// A `JsValue` containing the decimal string representation of the result.
#[wasm_bindgen]
pub fn subtract_prime_field(a: &str, b: &str) -> JsValue {
    let a_scalar: ScalarField = ScalarField::from(biguint_from_hex_string(a));
    let b_scalar: ScalarField = ScalarField::from(biguint_from_hex_string(b));

    // Perform subtraction
    let result: ScalarField = a_scalar - b_scalar;
    let result_bigint: BigUint = result.into();
    JsValue::from_str(&result_bigint.to_string())
}

/// Computes the Poseidon2 hash of the input string and returns a BigInt as a string.
///
/// Note: Ensure the input is within the field of the BN254 curve and is a BigInt formatted as a hex string.
#[wasm_bindgen]
pub fn compute_poseidon_hash(value: &str) -> JsValue {
    let input = [ScalarField::from(biguint_from_hex_string(value))];
    let res = _compute_poseidon_hash(&input);
    // Convert the hash result to a JavaScript BigInt as a string
    JsValue::from_str(&res.to_string())
}

/// Generates a signature for a wallet update operation.
///
/// This function takes a serialized wallet and the root secret key as inputs,
/// generates a signature for the wallet update, and returns the signature as a hex-encoded string.
///
/// # Arguments
///
/// * `wallet_str` - A string slice that holds the serialized wallet data.
/// * `sk_root` - A string slice that holds the root secret key.
///
/// # Returns
///
/// A `JsValue` containing the hex-encoded signature string.
#[wasm_bindgen]
pub fn generate_wallet_update_signature(wallet_str: &str, sk_root: &str) -> JsValue {
    let wallet = deserialize_wallet(wallet_str);
    let (signing_key, _) = get_root_key(sk_root);
    let sig = gen_update_wallet_signature(wallet, &signing_key);
    let sig_bytes = sig.to_vec();
    JsValue::from_str(&hex::encode(sig_bytes))
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
    let (sk_root, pk_root) = get_root_key(sk_root);
    let encoded_key = pk_root.as_affine().to_encoded_point(false /* compress */);
    let x_coord = point_coord_to_string(encoded_key.x().unwrap());
    let y_coord = point_coord_to_string(encoded_key.y().unwrap());
    let (_, pk_match) = get_match_key(sk_root);
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
    let (sk_root, pk_root) = get_root_key(sk_root);
    let (sk_match, pk_match) = get_match_key(sk_root.clone());
    let key_hierarchy = format!(
        r#"{{"public_keys":{{"pk_root":"0x{}","pk_match":"0x{}"}},"private_keys":{{"sk_root":"0x{}","sk_match":"0x{}"}}}}"#,
        hex::encode(pk_root.to_encoded_point(false).as_bytes()), // pk_root
        pk_match.serialize_to_hex(),                             // pk_match
        hex::encode(sk_root.to_bytes()),                         // sk_root
        sk_match.serialize_to_hex()                              // sk_match
    );
    JsValue::from_str(&key_hierarchy)
}

/// Generates a signature for updating a wallet by hashing the wallet's share commitments
/// and using the provided signing key to sign the hash.
///
/// # Arguments
///
/// * `wallet` - The `Wallet` instance containing the share commitments to be signed.
/// * `signing_key` - A reference to the `SigningKey` used to sign the hash of the commitments.
///
/// # Returns
///
/// * A `Signature` object representing the ECDSA signature of the hashed commitments.
#[wasm_bindgen]
pub fn get_shares_commitment(wallet_str: &str) -> JsValue {
    let wallet = deserialize_wallet(wallet_str);
    // Get total shares
    let shares_commitment = _compute_poseidon_hash(
        &[
            vec![wallet.get_private_share_commitment()],
            wallet.blinded_public_shares,
        ]
        .concat(),
    )
    .to_string();
    JsValue::from_str(&shares_commitment)
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
