#!/usr/bin/env bash
# Deploy + initialize the Signet Identity Registry to a Stellar network.
#
# Usage:
#   STELLAR_ACCOUNT=<deployer-key-name> NETWORK=testnet ./infra/deploy-contract.sh
#
# Requires the `stellar` CLI (https://stellar.org) with a configured identity:
#   stellar keys generate deployer --network testnet --fund
#
# Prints the deployed contract id. Set it as NEXT_PUBLIC_IDENTITY_REGISTRY_ID
# (web) and INDEXER_REGISTRY_CONTRACT_ID (indexer).
set -euo pipefail

NETWORK="${NETWORK:-testnet}"
ACCOUNT="${STELLAR_ACCOUNT:-deployer}"
ADMIN="${ADMIN_ADDRESS:-}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONTRACTS="$ROOT/packages/contracts"
WASM="$CONTRACTS/target/wasm32v1-none/release/identity_registry.wasm"

echo "→ Building wasm (release)…"
( cd "$CONTRACTS" && cargo build --target wasm32v1-none --release )

echo "→ Optimizing…"
stellar contract optimize --wasm "$WASM" || true

echo "→ Deploying to $NETWORK as '$ACCOUNT'…"
CONTRACT_ID="$(stellar contract deploy \
  --wasm "$WASM" \
  --source "$ACCOUNT" \
  --network "$NETWORK")"
echo "   contract id: $CONTRACT_ID"

# Default the admin to the deployer's own address if not provided.
if [ -z "$ADMIN" ]; then
  ADMIN="$(stellar keys address "$ACCOUNT")"
fi

echo "→ initialize(admin=$ADMIN)…"
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$ACCOUNT" \
  --network "$NETWORK" \
  -- initialize --admin "$ADMIN"

echo
echo "✅ Deployed. Set these env vars:"
echo "   NEXT_PUBLIC_IDENTITY_REGISTRY_ID=$CONTRACT_ID"
echo "   INDEXER_REGISTRY_CONTRACT_ID=$CONTRACT_ID"
