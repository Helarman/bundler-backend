-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('SOLANA', 'TON');

-- CreateEnum
CREATE TYPE "DcaTxType" AS ENUM ('BUY', 'SELL', 'FULL_SELL');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SYSTEM', 'ADMIN');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "type" "AccountType" NOT NULL DEFAULT 'SOLANA',
    "name" TEXT,
    "color" TEXT,
    "tokenAccountId" TEXT,
    "tokenBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isTokenBalanceSynced" BOOLEAN NOT NULL DEFAULT false,
    "isTokenAccountInitialized" BOOLEAN NOT NULL DEFAULT false,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isBalanceSynced" BOOLEAN NOT NULL DEFAULT false,
    "publicKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isImported" BOOLEAN NOT NULL DEFAULT false,
    "isRemoved" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exportedAt" TIMESTAMP(3),
    "lastBuyAt" TIMESTAMP(3),
    "lastSellAt" TIMESTAMP(3),
    "syncedAt" TIMESTAMP(3),
    "syncProblemInspectedAt" TIMESTAMP(3),
    "removedAt" TIMESTAMP(3),

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL DEFAULT '',
    "bondingCurveId" TEXT NOT NULL DEFAULT '',
    "associatedBondingCurveId" TEXT NOT NULL DEFAULT '',
    "balanceUsagePercent" INTEGER NOT NULL DEFAULT 50,
    "priorityMicroLamptorsFee" INTEGER NOT NULL DEFAULT 5000,
    "lastSyncedAt" TIMESTAMP(3),

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DcaSolanaAccount" (
    "accountId" TEXT NOT NULL,
    "bumpOperateSolAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.01,
    "minTokenAmountPerSale" INTEGER NOT NULL DEFAULT 1000,
    "maxTokenAmount" INTEGER NOT NULL DEFAULT 1000000000,
    "reserveTokenAmount" INTEGER NOT NULL DEFAULT 0,
    "reserveSolAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.01,
    "balanceUsagePercent" INTEGER NOT NULL DEFAULT 50,
    "minTokenPrice" DOUBLE PRECISION NOT NULL,
    "maxTokenPrice" DOUBLE PRECISION NOT NULL,
    "minDelayBetweenTxsInSeconds" INTEGER NOT NULL DEFAULT 30,
    "maxDelayBetweenTxsInSeconds" INTEGER NOT NULL DEFAULT 120,
    "slippagePercent" INTEGER NOT NULL DEFAULT 5,
    "canBuy" BOOLEAN NOT NULL DEFAULT true,
    "canSell" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "lastTxType" "DcaTxType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "allowNextAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DcaSolanaAccount_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "SolanaTx" (
    "txHash" TEXT NOT NULL,
    "signerIds" TEXT[],
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "isFailed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastScannedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "SolanaTx_pkey" PRIMARY KEY ("txHash")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "name" TEXT,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "rpcUrl" TEXT,
    "wssRpcUrl" TEXT,
    "devWallet" TEXT,
    "apiKey" TEXT,
    "transactionFee" DOUBLE PRECISION DEFAULT 0.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "isSettingConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastPasswordChangedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_publicKey_key" ON "Account"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DcaSolanaAccount" ADD CONSTRAINT "DcaSolanaAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("publicKey") ON DELETE RESTRICT ON UPDATE CASCADE;
