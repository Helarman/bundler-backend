import { Module } from "@nestjs/common";
import { AccountsService } from "../accounts/services/accounts.service";
import { AppService } from "../../app.service";
import { EncryptionService } from "../encryption/encryption.service";
import { PrismaService } from "../../prisma.service";
import { SolanaTokenController } from "./solana-token.controller";
import { SolanaTokenService } from "./solana-token.service";
import { SolanaService } from "../solana/services/solana.service";

@Module({
  imports: [],
  controllers: [SolanaTokenController],
  providers: [
    SolanaTokenService,
    AppService,
    SolanaService,
    PrismaService,
    AccountsService,
    EncryptionService,
  ],
  exports: [SolanaTokenModule],
})
export class SolanaTokenModule {}
