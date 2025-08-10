"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTokenModule = void 0;
const common_1 = require("@nestjs/common");
const accounts_service_1 = require("../accounts/services/accounts.service");
const app_service_1 = require("../../app.service");
const encryption_service_1 = require("../encryption/encryption.service");
const prisma_service_1 = require("../../prisma.service");
const solana_token_controller_1 = require("./solana-token.controller");
const solana_token_service_1 = require("./solana-token.service");
const solana_service_1 = require("../solana/services/solana.service");
let SolanaTokenModule = class SolanaTokenModule {
};
exports.SolanaTokenModule = SolanaTokenModule;
exports.SolanaTokenModule = SolanaTokenModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [solana_token_controller_1.SolanaTokenController],
        providers: [
            solana_token_service_1.SolanaTokenService,
            app_service_1.AppService,
            solana_service_1.SolanaService,
            prisma_service_1.PrismaService,
            accounts_service_1.AccountsService,
            encryption_service_1.EncryptionService,
        ],
        exports: [SolanaTokenModule],
    })
], SolanaTokenModule);
