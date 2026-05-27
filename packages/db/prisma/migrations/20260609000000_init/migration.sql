-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "displayName" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "pubkey" TEXT NOT NULL,
    "attestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'curated',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "deployerPubkey" TEXT NOT NULL,
    "deployedAt" TIMESTAMP(3) NOT NULL,
    "deployTxHash" TEXT NOT NULL,
    "network" TEXT NOT NULL DEFAULT 'mainnet',
    "contractType" TEXT,
    "firstIndexedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractSnapshot" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txCount24h" INTEGER NOT NULL DEFAULT 0,
    "txCountTotal" INTEGER NOT NULL DEFAULT 0,
    "lastActivity" TIMESTAMP(3),

    CONSTRAINT "ContractSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndexerCursor" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "lastLedger" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndexerCursor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_handle_key" ON "Profile"("handle");

-- CreateIndex
CREATE INDEX "Profile_handle_idx" ON "Profile"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_pubkey_key" ON "Wallet"("pubkey");

-- CreateIndex
CREATE INDEX "Wallet_profileId_idx" ON "Wallet"("profileId");

-- CreateIndex
CREATE INDEX "Wallet_pubkey_idx" ON "Wallet"("pubkey");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_address_key" ON "Contract"("address");

-- CreateIndex
CREATE INDEX "Contract_deployerPubkey_idx" ON "Contract"("deployerPubkey");

-- CreateIndex
CREATE INDEX "Contract_deployedAt_idx" ON "Contract"("deployedAt");

-- CreateIndex
CREATE INDEX "ContractSnapshot_contractId_capturedAt_idx" ON "ContractSnapshot"("contractId", "capturedAt");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractSnapshot" ADD CONSTRAINT "ContractSnapshot_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

