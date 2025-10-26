#!/bin/bash

# CityWorks Contract Deployment Script
# Deploys the contract to Stellar Testnet

set -e

echo "🚀 Deploying CityWorks Escrow Contract to Stellar Testnet..."

# Check if Soroban CLI is installed
if ! command -v soroban &> /dev/null; then
    echo "❌ Error: Soroban CLI is not installed."
    echo "Please install with: cargo install --locked soroban-cli"
    exit 1
fi

# Set network to testnet
NETWORK="testnet"
echo "📡 Using network: $NETWORK"

# Check if identity exists, if not create one
if ! soroban keys show deployer &> /dev/null; then
    echo "🔑 Creating deployer identity..."
    soroban keys generate deployer --network $NETWORK
fi

# Get the deployer address
DEPLOYER_ADDRESS=$(soroban keys address deployer)
echo "👤 Deployer address: $DEPLOYER_ADDRESS"

# Fund the deployer account on testnet
echo "💰 Funding deployer account..."
soroban keys fund deployer --network $NETWORK || echo "Account may already be funded"

# Path to optimized WASM
WASM_PATH="$(dirname "$0")/../contracts/cityworks-escrow/target/wasm32-unknown-unknown/release/cityworks_escrow.optimized.wasm"

if [ ! -f "$WASM_PATH" ]; then
    echo "❌ Error: Optimized WASM not found at $WASM_PATH"
    echo "Please run ./scripts/build_contract.sh first"
    exit 1
fi

# Deploy the contract
echo "📤 Deploying contract..."
CONTRACT_ID=$(soroban contract deploy \
  --wasm "$WASM_PATH" \
  --source deployer \
  --network $NETWORK)

echo ""
echo "✅ Contract deployed successfully!"
echo "📝 Contract ID: $CONTRACT_ID"
echo ""
echo "🔧 Next steps:"
echo "1. Add this to your app/.env.local file:"
echo "   NEXT_PUBLIC_ESCROW_CONTRACT_ID=$CONTRACT_ID"
echo "   NEXT_PUBLIC_STELLAR_NETWORK=testnet"
echo ""
echo "2. Initialize the contract if needed"
echo "3. Start seeding demo data with: npm run seed"
