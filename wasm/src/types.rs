use crate::helpers::{_compute_poseidon_hash, biguint_to_scalar};
use ark_bn254::Fr;
use num_bigint::BigUint;
use serde::{Deserialize, Serialize};

pub type ScalarField = Fr;

// ---------------------------
// | IdentificationKey Types |
// ---------------------------

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

// --------------------
// | Wallet API Types |
// --------------------

/// The wallet type, holds all balances, orders, fees, and randomness
/// for a trader
///
/// Also the unit of commitment in the state tree
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ApiWallet {
    /// The public secret shares of the wallet
    pub blinded_public_shares: Vec<BigUint>,
    /// The private secret shares of the wallet
    pub private_shares: Vec<BigUint>,
}

impl TryFrom<ApiWallet> for Wallet {
    type Error = String;
    fn try_from(wallet: ApiWallet) -> Result<Self, Self::Error> {
        // Deserialize the shares to scalar then re-structure into WalletSecretShare
        let blinded_public_shares: Vec<ScalarField> = wallet
            .blinded_public_shares
            .iter()
            .map(biguint_to_scalar)
            .collect();
        let private_shares: Vec<ScalarField> = wallet
            .private_shares
            .iter()
            .map(biguint_to_scalar)
            .collect();
        Ok(Wallet {
            blinded_public_shares,
            private_shares,
        })
    }
}

/// Represents a wallet managed by the local relayer
#[derive(Clone, Debug)]
pub struct Wallet {
    /// The private secret shares of the wallet
    pub private_shares: Vec<ScalarField>,
    /// The public secret shares of the wallet
    pub blinded_public_shares: Vec<ScalarField>,
}

impl Wallet {
    /// Computes the commitment to the private shares of the wallet
    pub fn get_private_share_commitment(&self) -> ScalarField {
        compute_wallet_private_share_commitment(&self.private_shares)
    }
}

/// Compute a commitment to a single share of a wallet
pub fn compute_wallet_private_share_commitment(private_share: &Vec<ScalarField>) -> ScalarField {
    _compute_poseidon_hash(&private_share)
}
