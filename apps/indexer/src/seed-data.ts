export interface SeedProfile {
  handle: string;
  displayName: string;
  bio: string;
  wallets: string[];
}

/**
 * Curated Phase-1 demo profiles. These are synthetic Stellar **testnet**
 * accounts — generated for the demo and owned by no one — mirroring the static
 * `/p/{handle}` pages (`apps/web/public/data/profiles.json`). Using synthetic
 * accounts avoids attributing invented personas to real wallets. Keep the two
 * sets in sync until the on-chain Identity Registry replaces curation in Phase 2.
 */
export const seedProfiles: SeedProfile[] = [
  {
    handle: 'aquawolf',
    displayName: 'Aqua Wolf',
    bio: 'Demo persona · Soroban DeFi builder exercising Blend-style collateral flows on testnet.',
    wallets: ['GASAAEJC6P5UZGRLYJ2I2KYLR7RXGF44JZXDYGCFBN7T5VIHECUUEMCD'],
  },
  {
    handle: 'sorobuilder',
    displayName: 'Soro Builder',
    bio: 'Demo persona · DEX trader running Soroswap-style swaps on testnet.',
    wallets: ['GBVBJEP2BSKHW6YBFCZR2HJKHZDLJOU7ZKTH2HSNUUQY322RWLURH3EQ'],
  },
  {
    handle: 'stellardev',
    displayName: 'Stellar Dev',
    bio: 'Demo persona · token operations and transfers on Stellar testnet.',
    wallets: ['GBNOH2NKPHZYOWF2LHLSZ27R54NMCH66KPBEEY6MCE4FM5V6PNZVHZKL'],
  },
];
