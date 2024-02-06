#!/bin/bash

OUTPUT_DIR="../dist/renegade-utils"
OUTPUT_NAME="index"

# Check for --test flag
TARGET="web"
for arg in "$@"
do
    if [ "$arg" == "--test" ]; then
        TARGET="bundler"
    fi
done

# Build the WebAssembly package with conditional target
wasm-pack build --target $TARGET --out-dir $OUTPUT_DIR --out-name $OUTPUT_NAME
# Optimize the WebAssembly binary
wasm-opt -Oz -o $OUTPUT_DIR/${OUTPUT_NAME}_bg.wasm $OUTPUT_DIR/${OUTPUT_NAME}_bg.wasm

# Delete the .gitignore file so the package is included
rm $OUTPUT_DIR/.gitignore


