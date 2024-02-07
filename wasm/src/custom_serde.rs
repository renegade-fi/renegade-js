use ark_ff::{BigInteger, Fp256, MontBackend, MontConfig, PrimeField};
use num_bigint::BigUint;

/// The number of u64s it takes to represent a field element
pub const NUM_U64S_FELT: usize = 4;

/// Type alias for a 256-bit prime field element in Montgomery form
pub type MontFp256<P> = Fp256<MontBackend<P, NUM_U64S_FELT>>;

/// A trait for serializing types into byte arrays
pub trait BytesSerializable {
    /// Serializes a type into a vector of bytes,
    /// for use in precompiles or the transcript
    fn serialize_to_bytes(&self) -> Vec<u8>;
    fn to_biguint(&self) -> BigUint;
}

impl<P: MontConfig<NUM_U64S_FELT>> BytesSerializable for MontFp256<P> {
    /// Serializes a field element into a big-endian byte array
    fn serialize_to_bytes(&self) -> Vec<u8> {
        self.into_bigint().to_bytes_be()
    }
    fn to_biguint(&self) -> BigUint {
        self.into_bigint().into()
    }
}
