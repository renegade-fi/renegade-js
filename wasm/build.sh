#!/bin/bash

OUTPUT_DIR="../renegade-utils"
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

# Delete the .gitignore file so the package is included
rm $OUTPUT_DIR/.gitignore

