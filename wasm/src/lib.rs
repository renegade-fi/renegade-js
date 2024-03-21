use helpers::{_compute_poseidon_hash, biguint_from_hex_string};
use num_bigint::BigUint;
use types::ScalarField;
use wasm_bindgen::prelude::*;

pub mod custom_serde;
pub mod errors;
pub mod helpers;
pub mod serde_def_types;
pub mod signature;
pub mod types;
pub mod wallet;

/// Ensures a value fits within the base field.
///
/// # Arguments
///
/// * `value` - A string representing the bigint in hex form.
///
/// # Returns
///
/// A `JsValue` containing the bigint within the prime field's order as a string.
#[wasm_bindgen]
pub fn hex_to_field_scalar(value: &str) -> JsValue {
    let bigint = biguint_from_hex_string(value).unwrap();
    let res = ScalarField::from(bigint);
    let result_bigint: BigUint = res.into();
    JsValue::from_str(&result_bigint.to_string())
}

/// Converts a hexadecimal string representation of a bigint into its limbs representation and returns it as a `JsValue`.
///
/// # Arguments
///
/// * `value` - A string slice that holds the hexadecimal representation of the bigint.
///
/// # Returns
///
/// A `JsValue` containing the JSON string representation of the bigint's limbs.
#[wasm_bindgen]
pub fn bigint_to_limbs(value: &str) -> JsValue {
    let bigint = biguint_from_hex_string(value).unwrap();
    let serialized = serde_json::to_string(&bigint).unwrap();
    JsValue::from_str(&serialized)
}

/// Adds two numbers in the prime field and returns the result as a string. Inputs are hex strings.
///
/// # Arguments
///
/// * `a` - A string representing the first number in hex form.
/// * `b` - A string representing the second number in hex form.
///
/// # Returns
///
/// A `JsValue` containing the decimal string representation of the result.
#[wasm_bindgen]
pub fn add(a: &str, b: &str) -> JsValue {
    let a_scalar = ScalarField::from(biguint_from_hex_string(a).unwrap());
    let b_scalar = ScalarField::from(biguint_from_hex_string(b).unwrap());

    // Perform addition
    let res = a_scalar + b_scalar;
    let result_bigint: BigUint = res.into();
    JsValue::from_str(&result_bigint.to_string())
}

/// Subtracts the second number from the first in the prime field and returns the result as a string. Inputs are hex strings.
///
/// # Arguments
///
/// * `a` - A string representing the first number in hex form.
/// * `b` - A string representing the second number in hex form to subtract from the first.
///
/// # Returns
///
/// A `JsValue` containing the decimal string representation of the result.
#[wasm_bindgen]
pub fn subtract(a: &str, b: &str) -> JsValue {
    let a_scalar = ScalarField::from(biguint_from_hex_string(a).unwrap());
    let b_scalar = ScalarField::from(biguint_from_hex_string(b).unwrap());

    // Perform subtraction
    let res = a_scalar - b_scalar;
    let result_bigint: BigUint = res.into();
    JsValue::from_str(&result_bigint.to_string())
}

/// Computes the Poseidon2 hash of the input string and returns a BigInt as a string.
///
/// Note: Ensure the input is within the field of the BN254 curve and is a BigInt formatted as a hex string.
#[wasm_bindgen]
pub fn compute_poseidon_hash(value: &str) -> JsValue {
    let input = [ScalarField::from(biguint_from_hex_string(value).unwrap())];
    let res = _compute_poseidon_hash(&input);
    // Convert the hash result to a JavaScript BigInt
    let result_bigint: BigUint = res.into();
    JsValue::from_str(&result_bigint.to_string())
}
