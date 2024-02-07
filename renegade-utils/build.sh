#!/bin/bash

OUTPUT_DIR="../dist/renegade-utils"

# Check for --test flag
TARGET="web"
for arg in "$@"
do
    if [ "$arg" == "--test" ]; then
        TARGET="bundler"
    fi
done

# Build the WebAssembly package with conditional target
wasm-pack build --target $TARGET --out-dir $OUTPUT_DIR

# Delete the .gitignore file so the package is included
rm $OUTPUT_DIR/.gitignore

