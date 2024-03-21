use crate::helpers::{
    _compute_poseidon_hash, deserialize_external_transfer, deserialize_wallet, get_root_key,
    to_contract_external_transfer,
};
use crate::{
    custom_serde::BytesSerializable,
    types::{ContractExternalTransfer, Wallet},
};
use base64::engine::{general_purpose as b64_general_purpose, Engine};
use ethers::{
    core::k256::ecdsa::SigningKey,
    types::{Bytes, Signature as EthersSignature, U256},
    utils::keccak256,
};
use eyre::Result;
use k256::ecdsa::{signature::Signer, Signature};
use serde::Serialize;
use wasm_bindgen::prelude::*;

const SIG_VALIDITY_WINDOW_MS: u64 = 10_000; // 10 seconds

/// Generates wallet update statement signature.
///
/// # Arguments
///
/// * `wallet_str` - Serialized wallet data.
/// * `sk_root` - sk_root in hex.
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

pub fn gen_update_wallet_signature(wallet: Wallet, signing_key: &SigningKey) -> EthersSignature {
    // Get total shares
    let shares_commitment = _compute_poseidon_hash(
        &[
            vec![wallet.get_private_share_commitment()],
            wallet.blinded_public_shares,
        ]
        .concat(),
    )
    .serialize_to_bytes();

    // Sign commitment
    hash_and_sign_message(signing_key, &shares_commitment)
}

/// Generates external transfer signature for withdrawals.
///
/// # Arguments
///
/// * `external_transfer_str` - Serialized external transfer data.
/// * `sk_root` - sk_root in hex.
///
/// # Returns
///
/// A `JsValue` containing the hex-encoded signature string.
#[wasm_bindgen]
pub fn generate_external_transfer_signature(external_transfer_str: &str, sk_root: &str) -> JsValue {
    let external_transfer = deserialize_external_transfer(external_transfer_str);
    // JsValue::from_str(&serde_json::to_string(&external_transfer).unwrap())
    let (signing_key, _) = get_root_key(sk_root);
    let contract_external_transfer = to_contract_external_transfer(&external_transfer).unwrap();
    let sig = gen_external_transfer_signature(contract_external_transfer, &signing_key);
    let sig_bytes = sig.to_vec();
    JsValue::from_str(&hex::encode(sig_bytes))
}

pub fn gen_external_transfer_signature(
    external_transfer: ContractExternalTransfer,
    signing_key: &SigningKey,
) -> EthersSignature {
    let transfer_bytes = serialize_to_calldata(&external_transfer).unwrap();
    hash_and_sign_message(signing_key, &transfer_bytes)
}

/// Generates authorization headers for HTTP requests to a relayer.
///
/// # Arguments
///
/// * `message` - The message to be signed.
/// * `timestamp` - The current timestamp.
/// * `sk_root` - sk_root in hex.
///
/// # Returns
///
/// * A vector of JavaScript values. The first element is the signature header,
///   and the second element is the expiration time of the signature.
#[wasm_bindgen]
pub fn sign_http_request(message: &str, timestamp: u64, sk_root: &str) -> Vec<JsValue> {
    let message_bytes = message.as_bytes();
    let expiration = timestamp + SIG_VALIDITY_WINDOW_MS;
    let payload = [message_bytes, &expiration.to_le_bytes()].concat();
    let (signing_key, _) = get_root_key(sk_root);
    let sig: Signature = signing_key.sign(&payload);
    let sig_bytes = sig.to_bytes().to_vec();
    let sig_header = b64_general_purpose::STANDARD_NO_PAD.encode(sig_bytes);
    vec![
        JsValue::from_str(&sig_header),
        JsValue::from_str(&expiration.to_string()),
    ]
}

/// Sign a message with sk_root
///
/// # Arguments
///
/// * `message` - The message to be signed.
/// * `sk_root` - sk_root in hex.
///
/// # Returns
///
/// * A `JsValue` containing the hexadecimal string representation of the signature.
#[wasm_bindgen]
pub fn sign_message(message: &str, sk_root: &str) -> JsValue {
    let message_bytes = message.as_bytes();
    let (signing_key, _) = get_root_key(sk_root);
    let sig: Signature = signing_key.sign(message_bytes);
    let sig_hex = hex::encode(sig.to_bytes());
    JsValue::from_str(&sig_hex)
}

/// Serialize the given serializable type into a [`Bytes`] object
/// that can be passed in as calldata
pub fn serialize_to_calldata<T: Serialize>(t: &T) -> Result<Bytes> {
    Ok(postcard::to_allocvec(t)?.into())
}

/// Hashes the given message and generates a signature over it using the signing
/// key, as expected in ECDSA
pub fn hash_and_sign_message(signing_key: &SigningKey, msg: &[u8]) -> EthersSignature {
    let msg_hash = keccak256(msg);
    let (sig, recovery_id) = signing_key.sign_prehash_recoverable(&msg_hash).unwrap();
    let r: U256 = U256::from_big_endian(&sig.r().to_bytes());
    let s: U256 = U256::from_big_endian(&sig.s().to_bytes());
    EthersSignature {
        r,
        s,
        v: recovery_id.to_byte() as u64,
    }
}
#[cfg(test)]
mod tests {
    use super::*;
    use k256::ecdsa::{signature::Verifier, Signature};

    #[test]
    fn test_verify_hex_message() {
        // Keypair
        let hex_key = "05fb4b6c5af30b21e240d6c162d33599856bcb8c8489bc344da554ce96aa2a2a"; // Replace with an actual valid key hex string
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
        let payload: Vec<u8> = [].to_vec();

        // Reference Signature
        // let b64_signature = "HCNtcq2EB+ufbV5FpHpnmYzVkwECf+vK83szezBU6+VxvYmQQBuquH7/jh+yi0bZe/rdGKEf7mW4SBxf2T8hQQ";

        // Generated Signature
        // let sig: Signature = signing_key.sign(&payload);
        // let sig_b64 = b64_general_purpose::STANDARD_NO_PAD.encode(sig.to_bytes());
        // println!("Base 64 Encoded Signature: {}", sig_b64);
        let sig_b64 = "AsHgcWjOP3lylxuuzUBQtDIH3ojQZ1y80c3DZqqZMbkB0LOhLhkSe4P6F1D85hRUhq/nkYksPGbXcSUc74lA2A";
        let sig_bytes = b64_general_purpose::STANDARD_NO_PAD
            .decode(sig_b64)
            .unwrap();

        // Signature from relayer
        // let sig_bytes: Vec<u8> = [
        //     4, 234, 237, 146, 62, 73, 98, 66, 150, 15, 101, 144, 80, 181, 236, 212, 242, 88, 130,
        //     201, 103, 86, 186, 194, 120, 106, 41, 39, 61, 115, 209, 41, 46, 91, 54, 127, 93, 55,
        //     14, 47, 12, 245, 109, 111, 21, 167, 136, 147, 40, 208, 125, 231, 24, 82, 207, 87, 23,
        //     197, 176, 215, 193, 104, 231, 196,
        // ]
        // .to_vec();

        // Verify Message
        // let sig = b64_general_purpose::STANDARD_NO_PAD
        //     .decode(b64_signature)
        //     .unwrap();
        // let sig = Signature::from_slice(&sig).unwrap();
        // let sig = Signature::from_bytes(&sig_bytes).unwrap();
        let sig = Signature::from_slice(&sig_bytes).unwrap();
        let expected: Signature = signing_key.sign(&payload);
        println!(
            "Expected: {:?}",
            b64_general_purpose::STANDARD_NO_PAD.encode(expected.to_bytes())
        );

        // Verify the signature
        assert!(verifying_key.verify(&payload, &sig).is_ok())
    }
}
