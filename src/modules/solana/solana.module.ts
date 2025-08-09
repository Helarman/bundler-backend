import { Module } from "@nestjs/common";
import { AccountsService } from "../accounts/services/accounts.service";

import { AppService } from "../../app.service";
import { EncryptionService } from "../encryption/encryption.service";
import { PrismaService } from "../../prisma.service";
import { SolanaDcaService } from "../solana-dca/services/solana-dca.service";
import { SolanaTokenService } from "../solana-token/solana-token.service";
import { SolanaBlockhainSynchronizerJob } from "./jobs/synchronizer.job";
import { SolanaProviderService } from "./services/solana-provider.service";
import { SolanaTransactionsService } from "./services/solana-transactions.service";

import { SolanaService } from "./services/solana.service";
import { SolanaController } from "./solana.controller";

@Module({
  controllers: [SolanaController],
  providers: [
    SolanaProviderService,
    SolanaBlockhainSynchronizerJob,
    AccountsService,
    PrismaService,
    EncryptionService,
    SolanaService,
    SolanaTokenService,
    AppService,
    SolanaDcaService,
    SolanaTransactionsService,
  ],
  exports: [SolanaService, SolanaTransactionsService],
})
export class SolanaModule {}
