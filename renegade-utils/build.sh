#!/bin/bash

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
wasm-pack build --release --target $TARGET

# Delete the .gitignore file so the package is included
rm pkg/.gitignore

