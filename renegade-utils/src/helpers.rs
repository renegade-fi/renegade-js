use crate::types::{
    ApiWallet, PublicIdentificationKey, ScalarField, SecretIdentificationKey, Wallet,
};
use ark_ff::PrimeField;
use k256::ecdsa::{signature::Signer, Signature, SigningKey, VerifyingKey};
use num_bigint::BigUint;
use num_traits::Num;
use renegade_crypto::hash::Poseidon2Sponge;
use sha2::{Digest, Sha256};

const CREATE_SK_MATCH_MESSAGE: &str = "Unlock your Renegade match key.\nTestnet v0";

// -----------------------------------
// | Wallet Update Signature Helpers |
// -----------------------------------

/// Deserializes a JSON string into a `Wallet` object.
pub fn deserialize_wallet(wallet_str: &str) -> Wallet {
    let wallet_bytes = wallet_str.as_bytes();
    let deserialized_wallet: ApiWallet = serde_json::from_reader(wallet_bytes).unwrap();
    deserialized_wallet.try_into().unwrap()
}

/// Convert a BigUint to a scalar
pub fn biguint_to_scalar(a: &BigUint) -> ScalarField {
    ScalarField::from(a.clone())
}

/// Converts a point coordinate to a vector of strings representing the coordinate's scalar field elements.
pub fn point_coord_to_string(coord_bytes: &[u8]) -> Vec<String> {
    let coord_bigint = BigUint::from_bytes_be(coord_bytes);
    let coord_words = split_biguint_into_words(coord_bigint);
    coord_words
        .iter()
        .map(|&scalar_field_element| {
            let bigint: BigUint = scalar_field_element.into(); // Convert ScalarField to BigUint
            bigint.to_string() // Convert BigUint to String
        })
        .collect::<Vec<String>>()
}

// -----------------------------------
// | Helpers |
// -----------------------------------

/// Computes the Poseidon2 hash of the given scalar inputs, squeezing a single-element output
pub fn _compute_poseidon_hash(inputs: &[ScalarField]) -> ScalarField {
    let mut sponge = Poseidon2Sponge::new();
    sponge.hash(inputs)
}

/// Parse a biguint from a hex string
pub fn biguint_from_hex_string(s: &str) -> BigUint {
    // Remove "0x"
    let s = s.strip_prefix("0x").unwrap_or(s);
    BigUint::from_str_radix(s, 16 /* radix */).expect("error parsing biguint from hex string")
}

/// Computes the SHA256 hash of the input
pub fn compute_sha256_hash(message: &[u8]) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(message);
    hasher.finalize().to_vec()
}

/// Return the modulus `p` of the `Scalar` ($Z_p$) field as a `BigUint`
pub fn get_scalar_field_modulus() -> BigUint {
    ScalarField::MODULUS.into()
}

/// Generates a `SecretIdentificationKey` and a `PublicIdentificationKey` from a given `SigningKey`.
pub fn get_match_key(sk_root: SigningKey) -> (SecretIdentificationKey, PublicIdentificationKey) {
    let sig: Signature = sk_root.sign(CREATE_SK_MATCH_MESSAGE.as_bytes());
    let message_hash = compute_sha256_hash(&sig.to_bytes());
    let sk_match =
        SecretIdentificationKey::from(ScalarField::from(BigUint::from_bytes_be(&message_hash)));
    let pk_match = sk_match.get_public_key();
    (sk_match, pk_match)
}

/// Return a `SigningKey` and a `Verifying` from a hex string
pub fn get_root_key(key: &str) -> (SigningKey, VerifyingKey) {
    let key_bigint = biguint_from_hex_string(&key);
    let signing_key = SigningKey::from_slice(&key_bigint.to_bytes_be()).unwrap();
    let verifying_key = signing_key.clone().verifying_key().to_owned();
    (signing_key, verifying_key)
}

/// Split a biguint into scalar words in little endian order
pub fn split_biguint_into_words(mut val: BigUint) -> [ScalarField; 2] {
    let scalar_mod = get_scalar_field_modulus();
    let mut res = Vec::with_capacity(2);
    for _ in 0..2 {
        let word = ScalarField::from(&val % &scalar_mod);
        val /= &scalar_mod;
        res.push(word);
    }
    res.try_into().unwrap()
}
