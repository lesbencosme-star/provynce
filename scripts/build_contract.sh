#!/bin/bash

# CityWorks Contract Build Script
# Builds the Soroban smart contract for deployment

set -e

echo "🏗️  Building CityWorks Escrow Contract..."

# Navigate to contract directory
cd "$(dirname "$0")/../contracts/cityworks-escrow"

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Error: Rust/Cargo is not installed."
    echo "Please install Rust from https://rustup.rs/"
    exit 1
fi

# Check if Soroban CLI is installed
if ! command -v soroban &> /dev/null; then
    echo "❌ Error: Soroban CLI is not installed."
    echo "Please install with: cargo install --locked soroban-cli"
    exit 1
fi

# Build the contract
echo "📦 Compiling contract..."
cargo build --target wasm32-unknown-unknown --release

# Optimize the WASM
echo "🔧 Optimizing WASM..."
soroban contract optimize \
  --wasm target/wasm32-unknown-unknown/release/cityworks_escrow.wasm

echo "✅ Contract built successfully!"
echo "📄 Optimized WASM: target/wasm32-unknown-unknown/release/cityworks_escrow.optimized.wasm"
