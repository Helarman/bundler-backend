import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AccountsModule } from "./modules/accounts/accounts.module";
import { ConfigModule } from "@nestjs/config";
import { EncryptionModule } from "./modules/encryption/encryption.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./modules/@core/guards/jwt-auth.guard";
import { SolanaModule } from "./modules/solana/solana.module";
import { ScheduleModule } from "@nestjs/schedule";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { SolanaTokenModule } from "./modules/solana-token/solana-token.module";
import { SolanaDcaModule } from "./modules/solana-dca/solana-dca.module";
import { PrismaService } from "./prisma.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    EncryptionModule,
    AccountsModule,
    AuthModule,
    UserModule,
    SolanaModule,
    SolanaTokenModule,
    SolanaDcaModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
    PrismaService
  ],
   exports: [AppService],
})
export class AppModule {}
