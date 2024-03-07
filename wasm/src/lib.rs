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
pub fn hex_to_field_scalar(value: &str) -> JsValue {
    let bigint = biguint_from_hex_string(value);
    let res = ScalarField::from(bigint);
    let result_bigint: BigUint = res.into();
    JsValue::from_str(&result_bigint.to_string())
}

/// Converts a hexadecimal string representation of a bigint into its limbs representation and returns it as a `JsValue`.
///
/// # Arguments
///
/// * `value` - A string slice that holds the hexadecimal representation of the bigint.
///
/// # Returns
///
/// A `JsValue` containing the JSON string representation of the bigint's limbs.
#[wasm_bindgen]
pub fn bigint_to_limbs(value: &str) -> JsValue {
    let bigint = biguint_from_hex_string(value);
    let serialized = serde_json::to_string(&bigint).unwrap();
    JsValue::from_str(&serialized)
}

pub fn bigint_to_limbs_test(value: &str) -> String {
    let bigint = biguint_from_hex_string(value);
    let serialized = serde_json::to_string(&bigint).unwrap();
    serialized
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
pub fn add(a: &str, b: &str) -> JsValue {
    let a_scalar = ScalarField::from(biguint_from_hex_string(a));
    let b_scalar = ScalarField::from(biguint_from_hex_string(b));

    // Perform addition
    let res = a_scalar + b_scalar;
    let result_bigint: BigUint = res.into();
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
pub fn subtract(a: &str, b: &str) -> JsValue {
    let a_scalar = ScalarField::from(biguint_from_hex_string(a));
    let b_scalar = ScalarField::from(biguint_from_hex_string(b));

    // Perform subtraction
    let res = a_scalar - b_scalar;
    let result_bigint: BigUint = res.into();
    JsValue::from_str(&result_bigint.to_string())
}

/// Computes the Poseidon2 hash of the input string and returns a BigInt as a string.
///
/// Note: Ensure the input is within the field of the BN254 curve and is a BigInt formatted as a hex string.
#[wasm_bindgen]
pub fn compute_poseidon_hash(value: &str) -> JsValue {
    let input = [ScalarField::from(biguint_from_hex_string(value))];
    let res = _compute_poseidon_hash(&input);
    // Convert the hash result to a JavaScript BigInt
    let result_bigint: BigUint = res.into();
    JsValue::from_str(&result_bigint.to_string())
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

#[cfg(test)]
mod tests {
    use super::*;
    use k256::ecdsa::signature::Verifier;

    #[test]
    fn test_bigint() {
        let bigint_hex = "0x1b97055ae8e69";
        let limbs = bigint_to_limbs_test(bigint_hex);
        println!("Limbs: {:?}", limbs);
    }

    #[test]
    fn test_message_gen() {
        let actual_message_bytes = [
            123, 34, 109, 101, 116, 104, 111, 100, 34, 58, 34, 115, 117, 98, 115, 99, 114, 105, 98,
            101, 34, 44, 34, 116, 111, 112, 105, 99, 34, 58, 34, 47, 118, 48, 47, 119, 97, 108,
            108, 101, 116, 47, 48, 102, 102, 51, 99, 99, 100, 49, 45, 99, 48, 50, 97, 45, 52, 102,
            100, 52, 45, 56, 100, 98, 53, 45, 101, 54, 97, 52, 102, 102, 49, 50, 54, 53, 50, 50,
            34, 125,
        ]
        .to_vec();

        let message =
            r#"{"method":"subscribe","topic":"/v0/wallet/0ff3ccd1-c02a-4fd4-8db5-e6a4ff126522"}"#;
        let message_bytes = message.as_bytes();
        assert_eq!(actual_message_bytes, message_bytes);
        // let expiration: u64 = 1709770523855;
        // let payload = [message_bytes, &expiration.to_le_bytes()].concat();
        // println!("Correct payload: {:?}", payload);
        // assert_eq!(payload, message_bytes);
        // dbg!(payload);
    }

    #[test]
    fn test_signature_gen() {
        let actual_signature_bytes = [
            41, 118, 121, 27, 204, 113, 31, 134, 41, 192, 251, 129, 194, 128, 21, 52, 40, 3, 98,
            213, 78, 98, 145, 216, 255, 197, 55, 81, 173, 120, 225, 164, 73, 143, 146, 162, 150,
            50, 14, 152, 176, 134, 186, 108, 161, 176, 126, 98, 129, 110, 2, 13, 124, 69, 137, 26,
            170, 108, 5, 99, 176, 33, 167, 147,
        ]
        .to_vec();

        let actual_message_bytes = [
            123, 34, 109, 101, 116, 104, 111, 100, 34, 58, 34, 115, 117, 98, 115, 99, 114, 105, 98,
            101, 34, 44, 34, 116, 111, 112, 105, 99, 34, 58, 34, 47, 118, 48, 47, 119, 97, 108,
            108, 101, 116, 47, 48, 102, 102, 51, 99, 99, 100, 49, 45, 99, 48, 50, 97, 45, 52, 102,
            100, 52, 45, 56, 100, 98, 53, 45, 101, 54, 97, 52, 102, 102, 49, 50, 54, 53, 50, 50,
            34, 125,
        ]
        .to_vec();

        let expiration: u64 = 1709770523855;
        let expiration_bytes = expiration.to_le_bytes();

        let payload = [actual_message_bytes, expiration_bytes.to_vec()].concat();

        let hex_key = "0da2372d5db68dfdc6fca0a676ee471dc6e5459be8f289df6c3017b819685566";
        let (signing_key, verifying_key) = get_root_key(hex_key);

        let sig: Signature = signing_key.sign(&payload);
        let sig_bytes = sig.to_bytes().to_vec();
        println!("Actual Signature: {:?}", actual_signature_bytes);
        println!("Correct Signature: {:?}", sig_bytes);
        assert_eq!(actual_signature_bytes, sig_bytes);
    }

    #[test]
    fn test_key_gen() {
        let hex_key = "0da2372d5db68dfdc6fca0a676ee471dc6e5459be8f289df6c3017b819685566"; // Replace with an actual valid key hex string
        let (signing_key, verifying_key) = get_root_key(hex_key);
        let sk_root = hex::encode(signing_key.to_bytes());
        // let bytes = verifying_key
        //     .to_encoded_point(false /* compress */)
        //     .as_bytes();
        let encoded_point = verifying_key.to_encoded_point(false); // Bind the temporary value to a variable
        let bytes = encoded_point.as_bytes(); // Now `as_bytes()` borrows from a value that lives long enough
        let pk_root = hex::encode(bytes);
        let (sk_match, pk_match) = get_match_key(signing_key);
        let sk_match_hex = sk_match.serialize_to_hex();
        let pk_match_hex = pk_match.serialize_to_hex();
        println!("SK ROOT: {}", sk_root);
        println!("PK ROOT: {}", pk_root);
        println!("PK MATCH: {:?}", pk_match_hex);
        println!("SK MATCH: {:?}", sk_match_hex);
    }

    #[test]
    fn test_verify_hex_message() {
        // Keypair
        let hex_key = "0da2372d5db68dfdc6fca0a676ee471dc6e5459be8f289df6c3017b819685566"; // Replace with an actual valid key hex string
        let (signing_key, verifying_key) = get_root_key(hex_key);
        let sk_root = hex::encode(signing_key.to_bytes());
        let pk_root = hex::encode(verifying_key.to_encoded_point(false).as_bytes());
        println!("SK ROOT: {}", sk_root);
        println!("PK ROOT: {}", pk_root);

        // // Message to sign
        // let message =
        //     r#"{"method":"subscribe","topic":"/v0/wallet/0ff3ccd1-c02a-4fd4-8db5-e6a4ff126522"}"#;
        // let message_bytes = message.as_bytes();
        // let expiration: u64 = 1709770523855;
        // let payload1 = [message_bytes, &expiration.to_le_bytes()].concat();
        // dbg!(payload1);

        // Payload from relayer
        let payload: Vec<u8> = [
            123, 34, 109, 101, 116, 104, 111, 100, 34, 58, 34, 115, 117, 98, 115, 99, 114, 105, 98,
            101, 34, 44, 34, 116, 111, 112, 105, 99, 34, 58, 34, 47, 118, 48, 47, 119, 97, 108,
            108, 101, 116, 47, 48, 102, 102, 51, 99, 99, 100, 49, 45, 99, 48, 50, 97, 45, 52, 102,
            100, 52, 45, 56, 100, 98, 53, 45, 101, 54, 97, 52, 102, 102, 49, 50, 54, 53, 50, 50,
            34, 125, 207, 196, 67, 22, 142, 1, 0, 0,
        ]
        .to_vec();

        // Reference Signature
        // let b64_signature = "HCNtcq2EB+ufbV5FpHpnmYzVkwECf+vK83szezBU6+VxvYmQQBuquH7/jh+yi0bZe/rdGKEf7mW4SBxf2T8hQQ";

        // Generated Signature
        // let sig: Signature = signing_key.sign(&payload);
        // let sig_b64 = b64_general_purpose::STANDARD_NO_PAD.encode(sig.to_bytes());
        // println!("Base 64 Encoded Signature: {}", sig_b64);

        // Signature from relayer
        let sig_bytes: Vec<u8> = [
            4, 234, 237, 146, 62, 73, 98, 66, 150, 15, 101, 144, 80, 181, 236, 212, 242, 88, 130,
            201, 103, 86, 186, 194, 120, 106, 41, 39, 61, 115, 209, 41, 46, 91, 54, 127, 93, 55,
            14, 47, 12, 245, 109, 111, 21, 167, 136, 147, 40, 208, 125, 231, 24, 82, 207, 87, 23,
            197, 176, 215, 193, 104, 231, 196,
        ]
        .to_vec();

        // Verify Message
        // let sig = b64_general_purpose::STANDARD_NO_PAD
        //     .decode(b64_signature)
        //     .unwrap();
        // let sig = Signature::from_slice(&sig).unwrap();
        // let sig = Signature::from_bytes(&sig_bytes).unwrap();
        let sig = Signature::from_slice(&sig_bytes).unwrap();

        // Verify the signature
        assert!(verifying_key.verify(&payload, &sig).is_ok())
    }
}
