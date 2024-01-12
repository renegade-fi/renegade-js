use base64::engine::{general_purpose as b64_general_purpose, Engine};
use helpers::{
    _compute_poseidon_hash, biguint_from_hex_string, get_match_key, get_root_key,
    point_coord_to_string,
};
use k256::{
    ecdsa::{signature::Signer, Signature},
    elliptic_curve::sec1::ToEncodedPoint,
};
use types::ScalarField;
use wasm_bindgen::prelude::*;

mod helpers;
mod types;

const SIG_VALIDITY_WINDOW_MS: u64 = 10_000; // 10 seconds

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "bigint")]
    pub type BigInt;
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
        let (signing_key, _) = get_root_key(hex_key);
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
        let (signing_key, _) = get_root_key(hex_key);
        let sig: Signature = signing_key.sign(&bytes);
        let b64 = b64_general_purpose::STANDARD_NO_PAD.encode(sig.to_bytes());
        println!("b64: {}", b64);
    }

    #[test]
    fn test_verify_hex_message() {
        // Example hex string representing a key
        let hex_key = "80ab14e9ac1abc104e2347d1040d9c22e0b1561cac5199faa6a9662925672f68"; // Replace with an actual valid key hex string

        // Generate a SigningKey from the hex string
        let (signing_key, verifying_key) = get_root_key(hex_key);

        // Example message
        let message_hex = r#"227b227075626c69635f7661725f736967223a5b5d2c2266726f6d5f61646472223a22307833663165616537643436643838663038666332663865643237666362326162313833656232643065222c226d696e74223a22307834303864613736653837353131343239343835633332653461643634376464313438323366646334222c22616d6f756e74223a5b312c302c302c302c302c302c302c305d2c2273746174656d656e745f7369673a226632353266363631383539343433356438646161303461356263383333373830323262316431316539386435636537633338393164313465386634656335383137353134336335396231386261666565373739356164313932306166663535626361343239353939643764666231353438386430336638346436386435613736227d22008e58b78c010000"#;
        let message = hex::decode(message_hex).unwrap();

        // Sign the message
        // let hex_signature = "bdd5dd87e6fa7c3e7022872e03c24c02e23657d8b5248e45c5f9dda00b95582942aa5500a9595ff6c4ddd76a628d3f996b26bfc63cc03421a036cfac51ecf0fc";
        // let sig = hex::decode(hex_signature).unwrap();
        // let sig: Signature = signing_key.sign(message.as_bytes());
        // let sig_bytes = sig.to_bytes().to_vec();
        // let sig_header = b64_general_purpose::STANDARD_NO_PAD.encode(sig_bytes);
        let b64_signature = "I6Nmd3e5wyEc2V0JEz1nV40kX2r/RvweTp5MfBTjLuphL6Ljs2q7ZAQnh0B5IXqoC4F4Uzhhc9rni71ZIYlPGg1";
        let sig = b64_general_purpose::STANDARD_NO_PAD
            .decode(b64_signature)
            .unwrap();
        let sig = Signature::from_slice(&sig).unwrap();

        // Verify the signature
        assert!(verifying_key.verify(&message, &sig).is_ok())
    }
}
