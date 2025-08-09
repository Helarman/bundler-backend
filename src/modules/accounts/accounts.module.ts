import { Module } from "@nestjs/common";

import { AccountsController } from "./controllers/accounts.controller";
import { AccountsService } from "./services/accounts.service";
import { PrismaService } from "../../prisma.service";
import { EncryptionService } from "../encryption/encryption.service";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";
import { AccountsSolanaController } from "./controllers/accounts-solana.controller";
import { SolanaTokenService } from "../solana-token/solana-token.service";
import { SolanaService } from "../solana/services/solana.service";
import { AppService } from "../../app.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [AccountsController, AccountsSolanaController],
  providers: [
    AppService,
    AccountsService,
    PrismaService,
    EncryptionService,
    ConfigService,
    UserService,
    SolanaService,
    SolanaTokenService,
  ],
  exports: [AccountsService],
})
export class AccountsModule {}
