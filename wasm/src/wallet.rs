use crate::helpers::jubjub_from_hex_string;
use crate::helpers::{get_match_key, get_root_key, point_coord_to_string};
use ethers::utils::keccak256;
use k256::ecdsa::SigningKey;
use k256::elliptic_curve::sec1::ToEncodedPoint;
use lazy_static::lazy_static;
use num_bigint::BigUint;
use num_traits::Num;
use wasm_bindgen::prelude::*;

lazy_static! {
    /// The secp256k1 scalar field modulus as a BigUint
    ///
    /// See https://en.bitcoin.it/wiki/Secp256k1 for more information
    static ref SECP256K1_SCALAR_MODULUS: BigUint = BigUint::from_str_radix(
        "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141",
        16,
    ).unwrap();
}

// Get sk_root from signature over ROOT_KEY_MESSAGE
#[wasm_bindgen]
pub fn derive_signing_key_from_signature(msg: &str) -> JsValue {
    let stripped = msg.strip_prefix("0x").unwrap_or(msg);
    let bytes = hex::decode(stripped).unwrap();
    let bytes_slice = bytes.as_slice();

    let sk_root = derive_signing_key(bytes_slice).unwrap();
    JsValue::from_str(&hex::encode(sk_root.to_bytes()))
}

/// Derive a signing key from a signature on a message
fn derive_signing_key(msg: &[u8]) -> Result<SigningKey, String> {
    let sig_bytes = get_extended_sig_bytes(msg)?;

    // We must manually reduce the bytes to the base field as the k256 library
    // expects byte representations to be of a valid base field element directly
    let unreduced_val = BigUint::from_bytes_be(&sig_bytes);
    let reduced_val = unreduced_val % &*SECP256K1_SCALAR_MODULUS;

    let key_bytes = reduced_val.to_bytes_be();
    SigningKey::from_bytes(key_bytes.as_slice().into())
        .map_err(|e| format!("failed to derive signing key from signature: {}", e))
}

// Hash and extend a signature to 64 bytes
fn get_extended_sig_bytes(msg: &[u8]) -> Result<[u8; EXTENDED_BYTES], String> {
    // Take the keccak hash of the signature to disperse its elements
    let bytes = msg.to_vec();
    let keccak_bytes = keccak256(bytes);
    Ok(extend_to_64_bytes(&keccak_bytes))
}

/// The number of bytes from a keccak hash
const KECCAK_HASH_BYTES: usize = 32;
/// The number of bytes we extend into to get a scalar
const EXTENDED_BYTES: usize = 64;

/// Extend the given byte array to 64 bytes, double the length of the original
///
/// This is necessary to give a uniform sampling of a field that these bytes are
/// reduced into, the bitlength must be significantly larger than the field's
/// bitlength to avoid sample bias via modular reduction
fn extend_to_64_bytes(bytes: &[u8]) -> [u8; EXTENDED_BYTES] {
    let mut extended = [0; EXTENDED_BYTES];
    let top_bytes = keccak256(bytes);
    extended[..KECCAK_HASH_BYTES].copy_from_slice(bytes);
    extended[KECCAK_HASH_BYTES..].copy_from_slice(&top_bytes);
    extended
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

/// Get the shares of the managing key cluster given the hex representation of the key.
///
/// # Arguments
///
/// * `managing_cluster_key` - The managing cluster key to compute the shares from.
///
/// # Returns
/// * A vector of JavaScript values. The first element is the x coordinate of the key, and the second element is the y coordinate of the key, in decimal.
#[wasm_bindgen]
pub fn get_managing_cluster_shares(managing_cluster_key: &str) -> Vec<JsValue> {
    let key = jubjub_from_hex_string(managing_cluster_key).unwrap();
    vec![
        JsValue::from_str(&key.x.to_string()),
        JsValue::from_str(&key.y.to_string()),
    ]
}
