use crate::{
    errors::ConversionError,
    types::{
        ApiWallet, BabyJubJubPoint, ContractExternalTransfer, EmbeddedCurveConfig,
        ExternalTransfer, ExternalTransferDirection, PublicIdentificationKey, ScalarField,
        SecretIdentificationKey, Wallet,
    },
};
use alloy_primitives::Address;
use ark_ec::twisted_edwards::Projective;
use ark_ff::PrimeField;
use ark_serialize::CanonicalDeserialize;
use k256::ecdsa::{signature::Signer, Signature, SigningKey, VerifyingKey};
use num_bigint::BigUint;
use num_traits::Num;
use renegade_crypto::hash::Poseidon2Sponge;
use ruint::aliases::{U160, U256};
use serde::{de::Error as DeserializeError, Deserialize, Deserializer, Serializer};
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

pub fn deserialize_external_transfer(transfer_str: &str) -> ExternalTransfer {
    let transfer_bytes = transfer_str.as_bytes();
    let deserialized_transfer: ExternalTransfer = serde_json::from_reader(transfer_bytes).unwrap();
    deserialized_transfer
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

// -----------
// | Helpers |
// -----------

/// Computes the Poseidon2 hash of the given scalar inputs, squeezing a single-element output
pub fn _compute_poseidon_hash(inputs: &[ScalarField]) -> ScalarField {
    let mut sponge = Poseidon2Sponge::new();
    sponge.hash(inputs)
}

/// A helper to deserialize a BigUint from a hex string
pub fn biguint_from_hex_string(hex: &str) -> Result<BigUint, String> {
    // Deserialize as a string and remove "0x" if present
    let stripped = hex.strip_prefix("0x").unwrap_or(hex);
    BigUint::from_str_radix(stripped, 16 /* radix */)
        .map_err(|e| format!("error deserializing BigUint from hex string: {e}"))
}

/// A helper to serialize a BigUint to a hex string
pub fn biguint_to_hex_string(val: &BigUint) -> String {
    format!("0x{}", val.to_str_radix(16 /* radix */))
}

/// A helper to serialize a BigUint to a hex string
pub fn serialize_biguint_to_hex_string<S>(val: &BigUint, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    let hex = biguint_to_hex_string(val);
    serializer.serialize_str(&hex)
}

/// A helper to deserialize a BigUint from a hex string
pub fn deserialize_biguint_from_hex_string<'de, D>(deserializer: D) -> Result<BigUint, D::Error>
where
    D: Deserializer<'de>,
{
    let hex = String::deserialize(deserializer)?;
    biguint_from_hex_string(&hex).map_err(D::Error::custom)
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
    let key_bigint = biguint_from_hex_string(key).unwrap();
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

/// Deserialize a Baby-JubJub point from a hex string
pub fn jubjub_from_hex_string(hex: &str) -> Result<BabyJubJubPoint, String> {
    // Deserialize as a string and remove "0x" if present
    let stripped = hex.strip_prefix("0x").unwrap_or(hex);
    let bytes = hex::decode(stripped)
        .map_err(|e| format!("error deserializing bytes from hex string: {e}"))?;

    let projective = Projective::<EmbeddedCurveConfig>::deserialize_uncompressed(bytes.as_slice())
        .map_err(|e| format!("error deserializing projective point from bytes: {:?}", e))?;
    Ok(projective.into())
}

/// Convert an [`ExternalTransfer`] to its corresponding smart contract type
pub fn to_contract_external_transfer(
    external_transfer: &ExternalTransfer,
) -> Result<ContractExternalTransfer, ConversionError> {
    let account_addr: U160 = external_transfer
        .account_addr
        .clone()
        .try_into()
        .map_err(|_| ConversionError::InvalidUint)?;
    let mint: U160 = external_transfer
        .mint
        .clone()
        .try_into()
        .map_err(|_| ConversionError::InvalidUint)?;
    let amount: U256 = external_transfer
        .amount
        .try_into()
        .map_err(|_| ConversionError::InvalidUint)?;

    Ok(ContractExternalTransfer {
        account_addr: Address::from(account_addr),
        mint: Address::from(mint),
        amount,
        is_withdrawal: external_transfer.direction == ExternalTransferDirection::Withdrawal,
    })
}
