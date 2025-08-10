"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const accounts_module_1 = require("./modules/accounts/accounts.module");
const config_1 = require("@nestjs/config");
const encryption_module_1 = require("./modules/encryption/encryption.module");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./modules/@core/guards/jwt-auth.guard");
const solana_module_1 = require("./modules/solana/solana.module");
const schedule_1 = require("@nestjs/schedule");
const event_emitter_1 = require("@nestjs/event-emitter");
const solana_token_module_1 = require("./modules/solana-token/solana-token.module");
const solana_dca_module_1 = require("./modules/solana-dca/solana-dca.module");
const prisma_service_1 = require("./prisma.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            encryption_module_1.EncryptionModule,
            accounts_module_1.AccountsModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            solana_module_1.SolanaModule,
            solana_token_module_1.SolanaTokenModule,
            solana_dca_module_1.SolanaDcaModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            app_service_1.AppService,
            prisma_service_1.PrismaService
        ],
        exports: [app_service_1.AppService],
    })
], AppModule);
