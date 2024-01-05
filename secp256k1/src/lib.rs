use base64::engine::{general_purpose as b64_general_purpose, Engine};
// use circuit_types::{
//     keychain::{PublicKeyChain, PublicSigningKey, SecretIdentificationKey},
//     traits::BaseType,
//     SizedWalletShare,
// };
// use constants::Scalar;
use k256::ecdsa::{signature::Signer, Signature, SigningKey};
use num_bigint::BigUint;
use num_traits::Num;
use sha2::{Digest, Sha256, Sha512};

use wasm_bindgen::prelude::*;

const SIG_VALIDITY_WINDOW_MS: u64 = 10_000; // 10 seconds
const CREATE_SK_MATCH_MESSAGE: &str = "Unlock your Renegade match key.\nTestnet v0";

// /// Get the shares of the key hierarchy computed from `sk_root`
// ///
// /// # Arguments
// ///
// /// * `sk_root` - The root key to compute the hierarchy from.
// ///
// /// # Returns
// /// * String representation of the shares of the key hierarchy.
// pub fn get_key_hierarchy_shares(sk_root: &str) -> Vec<JsValue> {
//     let signing_key = get_key(sk_root);
//     let public_signing_key = PublicSigningKey::from(signing_key.verifying_key());

//     let signed_msg: Signature = signing_key.sign(CREATE_SK_MATCH_MESSAGE.as_bytes());
//     let hashed_signed_msg = compute_sha256_hash(&signed_msg.to_bytes());
//     let sk_match = SecretIdentificationKey::from(Scalar::from_biguint(&BigUint::from_bytes_be(
//         &hashed_signed_msg,
//     )));
//     let pk_match = sk_match.get_public_key();

//     let x = public_signing_key.x.scalar_words;
//     let y = public_signing_key.y.scalar_words;
//     let pk_match_words = pk_match.key;

//     vec![
//         JsValue::from_str(&x.to_scalars()),
//         JsValue::from_str(&y.to_string()),
//         JsValue::from_str(&pk_match_words.to_string()),
//     ]
// }

// /// Get the string representation of the key hierarchy computed from `sk_root`
// ///
// /// # Arguments
// ///
// /// * `sk_root` - The root key to compute the hierarchy from.
// ///
// /// # Returns
// /// * String representation of the key hierarchy.
// #[wasm_bindgen]
// pub fn get_key_hierarchy(sk_root: &str) -> JsValue {
//     let signing_key = get_key(sk_root);
//     let verifying_key = signing_key.verifying_key();

//     let signed_msg: Signature = signing_key.sign(CREATE_SK_MATCH_MESSAGE.as_bytes());
//     let hashed_signed_msg = compute_sha256_hash(&signed_msg.to_bytes());

//     let sk_match = SecretIdentificationKey::from(Scalar::from_biguint(&BigUint::from_bytes_be(
//         &hashed_signed_msg,
//     )));
//     let pk_match = sk_match.get_public_key();

//     let key_hierarchy = format!(
//         r#"{{"public_keys":{{"pk_root":"{}","pk_match":"{}"}},"private_keys":{{"sk_root":"{}","sk_match":"{}"}}}}"#,
//         hex::encode(verifying_key.to_encoded_point(false).as_bytes()), // pk_root
//         hex::encode(pk_match.key.to_bytes_be()),                       // pk_match
//         hex::encode(signing_key.to_bytes()),                           // sk_root
//         hex::encode(sk_match.key.to_bytes_be())                        // sk_match
//     );
//     JsValue::from_str(&key_hierarchy)
// }

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
    let signing_key = get_key(key);
    let message_bytes = message.as_bytes();
    let expiration = timestamp + SIG_VALIDITY_WINDOW_MS;
    let payload = [message_bytes, &expiration.to_le_bytes()].concat();
    let sig: Signature = signing_key.sign(&payload);
    let sig_bytes = sig.to_bytes().to_vec();
    let sig_header = b64_general_purpose::STANDARD_NO_PAD.encode(sig_bytes);
    vec![
        JsValue::from_str(&sig_header),
        JsValue::from_str(&expiration.to_string()),
    ]
    // vec![JsValue::from_str(message), JsValue::from_str("2")]
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
    // let message_bytes = hex::decode(message).unwrap();
    let message_bytes = message.as_bytes();
    let signing_key = &get_key(key);
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
    let signing_key = get_key(key);
    let verifying_key = signing_key.verifying_key();
    let verifying_key_hex = hex::encode(verifying_key.to_encoded_point(false).as_bytes());
    JsValue::from_str(&verifying_key_hex)
}

#[wasm_bindgen]
pub fn hex_to_b64(hex: &str) -> JsValue {
    let bytes = hex::decode(hex).unwrap();
    let b64 = b64_general_purpose::STANDARD_NO_PAD.encode(bytes);
    JsValue::from_str(&b64)
}

pub fn get_key(key: &str) -> SigningKey {
    let key_bigint = biguint_from_hex_string(&key);
    SigningKey::from_slice(&key_bigint.to_bytes_be()).unwrap()
}

fn compute_sha256_hash(message: &[u8]) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(message);
    hasher.finalize().to_vec()
}

/// Parse a biguint from a hex string
fn biguint_from_hex_string(s: &str) -> BigUint {
    // Remove "0x"
    let s = s.strip_prefix("0x").unwrap_or(s);
    BigUint::from_str_radix(s, 16 /* radix */).expect("error parsing biguint from hex string")
}

#[cfg(test)]
mod tests {
    use super::*;
    use k256::ecdsa::signature::Verifier;

    #[test]
    fn test_body_signing() {
        let body_str = r#"{"public_var_sig":[],"from_addr":"0x3f1eae7d46d88f08fc2f8ed27fcb2ab183eb2d0e","mint":"0x408da76e87511429485c32e4ad647dd14823fdc4","amount":[1,0,0,0,0,0,0,0],"statement_sig:"fc62709d6b35f9ea968b9165642e90efd495058d290ef3093d4fcd24f722170a1e3536da5c75e8a78581c3f806fad9f7722fe1f0ee173ee0be9ab73ed861433a"}"#;
        let body_bytes = body_str.as_bytes();
        let expiration: u64 = 1704134587149;
        let payload = [body_bytes, &expiration.to_le_bytes()].concat();
        let payload_hex = hex::encode(&payload);
        println!("payload_hex: {}", payload_hex);
        let hex_key = "80ab14e9ac1abc104e2347d1040d9c22e0b1561cac5199faa6a9662925672f68"; // Replace with an actual valid key hex string
        let signing_key = get_key(hex_key);
        let sig: Signature = signing_key.sign(&payload);
        let sig_bytes = sig.to_bytes().to_vec();
        let sig_header = b64_general_purpose::STANDARD_NO_PAD.encode(sig_bytes);
        println!("sig_header: {}", sig_header);
    }

    #[test]
    fn test_hex_to_b64() {
        let hex_key = "80ab14e9ac1abc104e2347d1040d9c22e0b1561cac5199faa6a9662925672f68"; // Replace with an actual valid key hex string
        let hex = "7b227075626c69635f7661725f736967223a5b5d2c2266726f6d5f61646472223a22307833663165616537643436643838663038666332663865643237666362326162313833656232643065222c226d696e74223a22307834303864613736653837353131343239343835633332653461643634376464313438323366646334222c22616d6f756e74223a5b312c302c302c302c302c302c302c305d2c2273746174656d656e745f7369673a226632353266363631383539343433356438646161303461356263383333373830323262316431316539386435636537633338393164313465386634656335383137353134336335396231386261666565373739356164313932306166663535626361343239353939643764666231353438386430336638346436386435613736227d318b30b78c010000";
        let bytes = hex::decode(hex).unwrap();
        let signing_key = &get_key(hex_key);
        let sig: Signature = signing_key.sign(&bytes);
        let b64 = b64_general_purpose::STANDARD_NO_PAD.encode(sig.to_bytes());
        println!("b64: {}", b64);
    }

    #[test]
    fn test_verify_hex_message() {
        // Example hex string representing a key
        let hex_key = "80ab14e9ac1abc104e2347d1040d9c22e0b1561cac5199faa6a9662925672f68"; // Replace with an actual valid key hex string

        // Generate a SigningKey from the hex string
        let signing_key = get_key(hex_key);

        // Example message
        let message_hex = r#"227b227075626c69635f7661725f736967223a5b5d2c2266726f6d5f61646472223a22307833663165616537643436643838663038666332663865643237666362326162313833656232643065222c226d696e74223a22307834303864613736653837353131343239343835633332653461643634376464313438323366646334222c22616d6f756e74223a5b312c302c302c302c302c302c302c305d2c2273746174656d656e745f7369673a226632353266363631383539343433356438646161303461356263383333373830323262316431316539386435636537633338393164313465386634656335383137353134336335396231386261666565373739356164313932306166663535626361343239353939643764666231353438386430336638346436386435613736227d22008e58b78c010000"#;
        let message = hex::decode(message_hex).unwrap();

        // Sign the message
        // let hex_signature = "bdd5dd87e6fa7c3e7022872e03c24c02e23657d8b5248e45c5f9dda00b95582942aa5500a9595ff6c4ddd76a628d3f996b26bfc63cc03421a036cfac51ecf0fc";
        // let signature = hex::decode(hex_signature).unwrap();
        // let sig: Signature = signing_key.sign(message.as_bytes());
        // let sig_bytes = sig.to_bytes().to_vec();
        // let sig_header = b64_general_purpose::STANDARD_NO_PAD.encode(sig_bytes);
        let b64_signature = "I6Nmd3e5wyEc2V0JEz1nV40kX2r/RvweTp5MfBTjLuphL6Ljs2q7ZAQnh0B5IXqoC4F4Uzhhc9rni71ZIYlPGg1";
        let signature = b64_general_purpose::STANDARD_NO_PAD
            .decode(b64_signature)
            .unwrap();
        let sig = Signature::from_slice(&signature).unwrap();

        // Get the verifying key
        let verifying_key = signing_key.verifying_key();

        // Verify the signature
        assert!(verifying_key.verify(&message, &sig).is_ok())
    }
}
