# @signet/contracts — Soroban smart contracts

Rust/Soroban smart contracts for Signet, managed as a Cargo workspace
(separate from the pnpm/TypeScript workspace).

## Crates

- [`identity-registry`](./identity-registry) — binds a Stellar wallet to a
  Signet identity via signed, on-chain claims. Implemented; 13 tests.

## Prerequisites

- Rust (stable) — https://rustup.rs
- `wasm32v1-none` target:

  ```bash
  rustup target add wasm32v1-none
  ```

- (Optional) Soroban CLI for deployment:

  ```bash
  cargo install --locked soroban-cli
  ```

## Build

```bash
# Native build + tests
cargo test --manifest-path packages/contracts/Cargo.toml

# Wasm build (deployment artifact)
cargo build \
  --manifest-path packages/contracts/identity-registry/Cargo.toml \
  --target wasm32v1-none --release
```
