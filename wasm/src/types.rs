use crate::{
    helpers::{_compute_poseidon_hash, biguint_to_scalar, deserialize_biguint_from_hex_string},
    serde_def_types::{AddressDef, U256Def},
};
use alloy_primitives::{Address, U256};
use ark_bn254::Fr;
use ark_ec::{twisted_edwards::Projective, CurveGroup};
use num_bigint::BigUint;
use serde::{Deserialize, Serialize};
use serde_with::serde_as;

pub type ScalarField = Fr;

// ----------------------
// | EncryptionKey Type |
// ----------------------

/// A type alias representing an encryption key in the ElGamal over BabyJubJub
/// cryptosystem
pub type EncryptionKey = BabyJubJubPoint;

/// The config of the embedded curve
pub type EmbeddedCurveConfig = ark_ed_on_bn254::EdwardsConfig;

/// The affine representation of a point on the BabyJubJub curve
#[derive(Copy, Clone, Debug, PartialEq, Eq)]
pub struct BabyJubJubPoint {
    /// The x coordinate of the point
    pub x: ScalarField,
    /// The y coordinate of the point
    pub y: ScalarField,
}
impl From<Projective<EmbeddedCurveConfig>> for BabyJubJubPoint {
    fn from(value: Projective<EmbeddedCurveConfig>) -> Self {
        let affine = value.into_affine();
        BabyJubJubPoint {
            x: ScalarField::from(affine.x),
            y: ScalarField::from(affine.y),
        }
    }
}

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

/// The wallet type, holds all balances, orders, and randomness
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

/// The type used to track an amount
pub type Amount = u128;
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct ExternalTransfer {
    /// The address of the account contract to transfer to/from
    #[serde(deserialize_with = "deserialize_biguint_from_hex_string")]
    pub account_addr: BigUint,
    /// The mint (ERC20 address) of the token to transfer
    #[serde(deserialize_with = "deserialize_biguint_from_hex_string")]
    pub mint: BigUint,
    /// The amount of the token transferred
    pub amount: Amount,
    /// The direction of transfer
    pub direction: ExternalTransferDirection,
}

/// Represents an external transfer of an ERC20 token
#[serde_as]
#[derive(Serialize, Deserialize, Default)]
pub struct ContractExternalTransfer {
    /// The address of the account contract to deposit from or withdraw to
    #[serde_as(as = "AddressDef")]
    pub account_addr: Address,
    /// The mint (contract address) of the token being transferred
    #[serde_as(as = "AddressDef")]
    pub mint: Address,
    /// The amount of the token transferred
    #[serde_as(as = "U256Def")]
    pub amount: U256,
    /// Whether or not the transfer is a withdrawal (otherwise a deposit)
    pub is_withdrawal: bool,
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, PartialEq)]
pub enum ExternalTransferDirection {
    /// Deposit an ERC20 into the darkpool from an external address
    Deposit = 0,
    /// Withdraw an ERC20 from the darkpool to an external address
    Withdrawal,
}
