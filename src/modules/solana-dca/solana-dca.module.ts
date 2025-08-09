import { Module } from "@nestjs/common";
import { AccountsService } from "../accounts/services/accounts.service";
import { AppService } from "../../app.service";
import { EncryptionService } from "../encryption/encryption.service";
import { PrismaService } from "../../prisma.service";
import { SolanaDcaJob } from "./jobs/dca.job";
import { SolanaDcaService } from "./services/solana-dca.service";
import { SolanaDcaController } from "./solana-dca.controller";
import { SolanaTokenService } from "../solana-token/solana-token.service";
import { SolanaTransactionsService } from "../solana/services/solana-transactions.service";
import { SolanaService } from "../solana/services/solana.service";

@Module({
  controllers: [SolanaDcaController],
  imports: [],
  providers: [
    PrismaService,
    EncryptionService,
    SolanaTokenService,
    SolanaDcaService,
    AppService,
    SolanaService,
    AccountsService,
    SolanaDcaJob,
    SolanaTransactionsService,
  ],
  exports: [SolanaDcaService],
})
export class SolanaDcaModule {}
