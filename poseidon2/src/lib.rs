use num_bigint::BigUint;
use num_traits::Num;
use renegade_crypto::hash::Poseidon2Sponge;
use renegade_crypto::hash::ScalarField;
use wasm_bindgen::prelude::*;

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
    let input_seq = ScalarField::from(biguint_from_hex_string(value).unwrap());
    let mut hasher = Poseidon2Sponge::new();
    let res = hasher.hash(&[input_seq]);

    // Convert the hash result to a JavaScript BigInt
    let js_bigint: JsValue = res.to_string().into();
    js_bigint.unchecked_into::<BigInt>()
}

/// A helper to deserialize a BigUint from a hex string
pub fn biguint_from_hex_string(hex: &str) -> Result<BigUint, String> {
    // Deserialize as a string and remove "0x" if present
    let stripped = hex.strip_prefix("0x").unwrap_or(hex);
    BigUint::from_str_radix(stripped, 16 /* radix */)
        .map_err(|e| format!("error deserializing BigUint from hex string: {e}"))
}
