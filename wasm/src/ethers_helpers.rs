// TODO: Should merge into helpers, separate because of named import conflicts
use crate::custom_serde::BytesSerializable;
use crate::helpers::_compute_poseidon_hash;
use crate::types::Wallet;
use ethers::{
    core::k256::ecdsa::SigningKey,
    types::{Signature, U256},
    utils::keccak256,
};

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
pub fn gen_update_wallet_signature(wallet: Wallet, signing_key: &SigningKey) -> Signature {
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
    hash_and_sign_message(&signing_key, &shares_commitment)
}

/// Hashes the given message and generates a signature over it using the signing
/// key, as expected in ECDSA
pub fn hash_and_sign_message(signing_key: &SigningKey, msg: &[u8]) -> Signature {
    let msg_hash = keccak256(msg);
    let (sig, recovery_id) = signing_key.sign_prehash_recoverable(&msg_hash).unwrap();
    let r: U256 = U256::from_big_endian(&sig.r().to_bytes());
    let s: U256 = U256::from_big_endian(&sig.s().to_bytes());
    Signature {
        r,
        s,
        v: recovery_id.to_byte() as u64,
    }
}
