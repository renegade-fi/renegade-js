#!/bin/bash

OUTPUT_DIR="../dist/poseidon2"
OUTPUT_NAME="index"

# Build the WebAssembly package
wasm-pack build --target web --out-dir $OUTPUT_DIR --out-name $OUTPUT_NAME

# Optimize the WebAssembly binary
wasm-opt -Oz -o $OUTPUT_DIR/${OUTPUT_NAME}_bg.wasm $OUTPUT_DIR/${OUTPUT_NAME}_bg.wasm

# Delete the .gitignore file so the package is included
rm $OUTPUT_DIR/.gitignore

