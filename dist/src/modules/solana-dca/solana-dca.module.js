"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDcaModule = void 0;
const common_1 = require("@nestjs/common");
const accounts_service_1 = require("../accounts/services/accounts.service");
const app_service_1 = require("../../app.service");
const encryption_service_1 = require("../encryption/encryption.service");
const prisma_service_1 = require("../../prisma.service");
const dca_job_1 = require("./jobs/dca.job");
const solana_dca_service_1 = require("./services/solana-dca.service");
const solana_dca_controller_1 = require("./solana-dca.controller");
const solana_token_service_1 = require("../solana-token/solana-token.service");
const solana_transactions_service_1 = require("../solana/services/solana-transactions.service");
const solana_service_1 = require("../solana/services/solana.service");
let SolanaDcaModule = class SolanaDcaModule {
};
exports.SolanaDcaModule = SolanaDcaModule;
exports.SolanaDcaModule = SolanaDcaModule = __decorate([
    (0, common_1.Module)({
        controllers: [solana_dca_controller_1.SolanaDcaController],
        imports: [],
        providers: [
            prisma_service_1.PrismaService,
            encryption_service_1.EncryptionService,
            solana_token_service_1.SolanaTokenService,
            solana_dca_service_1.SolanaDcaService,
            app_service_1.AppService,
            solana_service_1.SolanaService,
            accounts_service_1.AccountsService,
            dca_job_1.SolanaDcaJob,
            solana_transactions_service_1.SolanaTransactionsService,
        ],
        exports: [solana_dca_service_1.SolanaDcaService],
    })
], SolanaDcaModule);
