"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaModule = void 0;
const common_1 = require("@nestjs/common");
const accounts_service_1 = require("../accounts/services/accounts.service");
const app_service_1 = require("../../app.service");
const encryption_service_1 = require("../encryption/encryption.service");
const prisma_service_1 = require("../../prisma.service");
const solana_dca_service_1 = require("../solana-dca/services/solana-dca.service");
const solana_token_service_1 = require("../solana-token/solana-token.service");
const synchronizer_job_1 = require("./jobs/synchronizer.job");
const solana_provider_service_1 = require("./services/solana-provider.service");
const solana_transactions_service_1 = require("./services/solana-transactions.service");
const solana_service_1 = require("./services/solana.service");
const solana_controller_1 = require("./solana.controller");
let SolanaModule = class SolanaModule {
};
exports.SolanaModule = SolanaModule;
exports.SolanaModule = SolanaModule = __decorate([
    (0, common_1.Module)({
        controllers: [solana_controller_1.SolanaController],
        providers: [
            solana_provider_service_1.SolanaProviderService,
            synchronizer_job_1.SolanaBlockhainSynchronizerJob,
            accounts_service_1.AccountsService,
            prisma_service_1.PrismaService,
            encryption_service_1.EncryptionService,
            solana_service_1.SolanaService,
            solana_token_service_1.SolanaTokenService,
            app_service_1.AppService,
            solana_dca_service_1.SolanaDcaService,
            solana_transactions_service_1.SolanaTransactionsService,
        ],
        exports: [solana_service_1.SolanaService, solana_transactions_service_1.SolanaTransactionsService],
    })
], SolanaModule);
