use crate::helpers::_compute_poseidon_hash;
use ark_bn254::Fr;
use num_bigint::BigUint;

pub type ScalarField = Fr;

/// A secret identification key is the hash preimage of the public
/// identification key
pub struct SecretIdentificationKey {
    pub key: ScalarField,
}

impl From<ScalarField> for SecretIdentificationKey {
    fn from(key: ScalarField) -> Self {
        Self { key }
    }
}

impl SecretIdentificationKey {
    /// Get the public key corresponding to this secret key
    pub fn get_public_key(&self) -> PublicIdentificationKey {
        let key = _compute_poseidon_hash(&[self.key]);
        PublicIdentificationKey { key }
    }
    pub fn serialize_to_hex(&self) -> String {
        // Assuming ScalarField can be converted to BigUint
        // self.key.to_biguint().to_str_radix(16)
        let bigint_key: BigUint = self.key.into();
        bigint_key.to_str_radix(16)
    }
}

/// A public identification key is the image-under-hash of the secret
/// identification key knowledge of which is proved in a circuit
pub struct PublicIdentificationKey {
    pub key: ScalarField,
}

impl PublicIdentificationKey {
    pub fn serialize_to_hex(&self) -> String {
        let bigint_key: BigUint = self.key.into();
        bigint_key.to_str_radix(16)
    }
}

impl From<ScalarField> for PublicIdentificationKey {
    fn from(key: ScalarField) -> Self {
        Self { key }
    }
}
