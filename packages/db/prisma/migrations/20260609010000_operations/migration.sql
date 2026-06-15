-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "function" TEXT,
    "decodedFunction" TEXT,
    "sourceAccount" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "transactionHash" TEXT,
    "successful" BOOLEAN NOT NULL DEFAULT true,
    "balanceChanges" JSONB,
    "indexedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Operation_walletId_createdAt_idx" ON "Operation"("walletId", "createdAt");

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

