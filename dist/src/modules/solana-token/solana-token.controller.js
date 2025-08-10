"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SolanaTokenController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTokenController = void 0;
const controller_decorator_1 = require("../@core/decorators/controller.decorator");
const serializable_decorator_1 = require("../@core/decorators/serializable.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const web3_js_1 = require("@solana/web3.js");
const accounts_service_1 = require("../accounts/services/accounts.service");
const transfer_all_dto_1 = require("./dtos/transfer-all.dto");
const transfer_all_response_entity_1 = require("./entities/transfer-all-response.entity");
const solana_token_service_1 = require("./solana-token.service");
const bs58 = __importStar(require("bs58"));
const event_emitter_1 = require("@nestjs/event-emitter");
const solana_events_1 = require("../solana/events/solana.events");
const solana_token_entity_1 = require("./entities/solana-token.entity");
const sell_all_dto_1 = require("./dtos/sell-all.dto");
const sleep_1 = require("../@core/utils/sleep");
const buy_all_dto_1 = require("./dtos/buy-all.dto");
const app_service_1 = require("../../app.service");
const create_spl_dto_1 = require("../solana-token/dtos/create-spl.dto");
const platform_express_1 = require("@nestjs/platform-express");
const prisma_service_1 = require("../../prisma.service");
const spl_token_1 = require("@solana/spl-token");
let SolanaTokenController = SolanaTokenController_1 = class SolanaTokenController {
    constructor(prismaService, appService, solanaTokenService, accountsService, eventEmitter) {
        this.prismaService = prismaService;
        this.appService = appService;
        this.solanaTokenService = solanaTokenService;
        this.accountsService = accountsService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(SolanaTokenController_1.name);
    }
    async getData() {
        return this.solanaTokenService.tokenData;
    }
    async createToken(payload, file) {
        const { owner } = payload;
        payload.buyers = JSON.parse(`[${payload.buyers}]`);
        const buyersAccounts = await this.prismaService.account.findMany({
            where: {
                ...(payload.buyers
                    ? {
                        publicKey: {
                            in: payload.buyers.map((buyer) => buyer.address),
                        },
                    }
                    : {}),
                isActive: true,
                balance: { gt: 0.01 },
            },
        });
        const account = await this.accountsService.findOne(owner);
        if (!account) {
            throw new common_1.BadRequestException(`Account with id ${owner} not found`);
        }
        const creatorSecretKey = await this.accountsService.getSecretKey(account.id);
        const creator = web3_js_1.Keypair.fromSecretKey(bs58.decode(creatorSecretKey));
        let txHashes = [];
        const buyerToSolAmountMap = new Map(payload.buyers.map((buyer) => [buyer.address, buyer.solAmount]));
        try {
            const { txHashes: _txHashes, mint, bondingCurve, associatedBondingCurve, } = await this.solanaTokenService.create(creator, payload, file, buyersAccounts.map((account) => {
                const solAmount = buyerToSolAmountMap.get(account.publicKey);
                const amount = Math.min(account.balance, solAmount);
                return {
                    address: account.publicKey,
                    solAmount: (amount * 80) / 100,
                };
            }));
            // Update app config
            await this.appService.update({
                tokenId: mint.publicKey.toBase58(),
                bondingCurveId: bondingCurve.toBase58(),
                associatedBondingCurveId: associatedBondingCurve.toBase58(),
            });
            await this.prismaService.account.updateMany({
                data: {
                    balance: 0,
                    tokenBalance: 0,
                    isTokenBalanceSynced: false,
                    syncProblemInspectedAt: null,
                    isBalanceSynced: false,
                    tokenAccountId: null,
                    isTokenAccountInitialized: false,
                    lastBuyAt: null,
                    lastSellAt: null,
                },
            });
            await this.prismaService.dcaSolanaAccount.updateMany({
                data: {
                    canBuy: false,
                    canSell: false,
                    isActive: false,
                },
            });
            const allAccounts = await this.prismaService.account.findMany({
                select: {
                    id: true,
                    publicKey: true,
                },
            });
            for (const account of allAccounts) {
                await this.accountsService.update(account.id, {
                    tokenAccountId: (0, spl_token_1.getAssociatedTokenAddressSync)(mint.publicKey, new web3_js_1.PublicKey(account.publicKey), true, spl_token_1.TOKEN_PROGRAM_ID, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID).toBase58(),
                });
            }
            txHashes = _txHashes;
        }
        catch (error) {
            this.logger.error(error);
            console.log(await error.getLogs(this.solanaTokenService.connection));
            throw new common_1.BadRequestException("Something went wrong");
        }
        return {
            txHashes,
        };
    }
    async buyAll(payload) {
        const { keepSolanaAmount, percent, slippagePercent, priorityMicroLamptorsFee, } = payload;
        const config = await this.appService.getConfig();
        const accounts = await this.accountsService.findAll({
            withSecretKeys: true,
        });
        const txHashes = [];
        for (const { publicKey, balance, secretKey } of accounts) {
            try {
                if (keepSolanaAmount && balance < keepSolanaAmount)
                    continue;
                const amountToBuy = (balance - (keepSolanaAmount ?? 0)) * (percent / 100);
                if (amountToBuy <= 0)
                    continue;
                const txHash = await this.solanaTokenService.buy(web3_js_1.Keypair.fromSecretKey(bs58.decode(secretKey)), amountToBuy, slippagePercent ?? 30, priorityMicroLamptorsFee ?? config.priorityMicroLamptorsFee);
                txHashes.push(txHash);
                this.eventEmitter.emit(solana_events_1.SolanaTxCreatedEvent.id, new solana_events_1.SolanaTxCreatedEvent({
                    txHash,
                    signerIds: [publicKey],
                }));
                await this.accountsService.update(publicKey, {
                    lastBuyAt: new Date(),
                });
                // Some sleep to avoid rate limit
                await (0, sleep_1.sleep)(200);
            }
            catch (error) {
                this.logger.error(error);
            }
        }
        return {
            txHashes,
        };
    }
    async transferAll(payload) {
        const { address, priorityMicroLamptorsFee } = payload;
        const accounts = await this.accountsService.findAll({
            withSecretKeys: true,
        });
        const filteredByBalance = accounts.filter((a) => a.balance > 0.00000535 && a.tokenBalance > 0);
        const accountWithMostBalance = filteredByBalance.reduce((acc, curr) => (curr.balance > acc.balance ? curr : acc), filteredByBalance?.[0]);
        const feePayer = web3_js_1.Keypair.fromSecretKey(bs58.decode(accountWithMostBalance.secretKey));
        const txHashes = [];
        try {
            const txHash = await this.solanaTokenService.transferAllFromManyToOne(feePayer, filteredByBalance.map((account) => web3_js_1.Keypair.fromSecretKey(bs58.decode(account.secretKey))), address, priorityMicroLamptorsFee);
            this.eventEmitter.emit(solana_events_1.SolanaTxCreatedEvent.id, new solana_events_1.SolanaTxCreatedEvent({
                txHash,
                signerIds: [feePayer.publicKey.toBase58()],
            }));
            txHashes.push(txHash);
        }
        catch (error) {
            this.logger.error(error);
        }
        return {
            txHashes,
        };
    }
    async sellAll(payload) {
        const { keepAmount, percent, slippagePercent, priorityMicroLamptorsFee } = payload;
        const config = await this.appService.getConfig();
        const accounts = await this.accountsService.findAll({
            withSecretKeys: true,
        });
        const txHashes = [];
        for (const { publicKey, tokenBalance, secretKey } of accounts) {
            try {
                if (keepAmount && tokenBalance < keepAmount)
                    continue;
                const amountToSell = (tokenBalance - (keepAmount ?? 0)) * (percent / 100);
                if (amountToSell <= 0)
                    continue;
                const txHash = await this.solanaTokenService.sell(web3_js_1.Keypair.fromSecretKey(bs58.decode(secretKey)), amountToSell, slippagePercent ?? 30, true, priorityMicroLamptorsFee ?? config.priorityMicroLamptorsFee);
                txHashes.push(txHash);
                this.eventEmitter.emit(solana_events_1.SolanaTxCreatedEvent.id, new solana_events_1.SolanaTxCreatedEvent({
                    txHash,
                    signerIds: [publicKey],
                }));
                await this.accountsService.update(publicKey, {
                    lastSellAt: new Date(),
                });
                // Some sleep to avoid rate limit
                await (0, sleep_1.sleep)(200);
            }
            catch (error) {
                this.logger.error(error);
            }
        }
        return {
            txHashes,
        };
    }
};
exports.SolanaTokenController = SolanaTokenController;
__decorate([
    (0, common_1.Get)(),
    (0, serializable_decorator_1.Serializable)(solana_token_entity_1.SolanaTokenDataEntity),
    (0, swagger_1.ApiOperation)({
        summary: "Get token data",
        description: "This method returns token data",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Token data",
        type: solana_token_entity_1.SolanaTokenDataEntity,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SolanaTokenController.prototype, "getData", null);
__decorate([
    (0, common_1.Post)(),
    (0, serializable_decorator_1.Serializable)(transfer_all_response_entity_1.TransactionsResponseEntity),
    (0, swagger_1.ApiOperation)({
        summary: "Create SPL token",
        description: "Creates PumpFun token",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Hash",
        type: transfer_all_response_entity_1.TransactionsResponseEntity,
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_spl_dto_1.CreatePumpFunTokenDto, Object]),
    __metadata("design:returntype", Promise)
], SolanaTokenController.prototype, "createToken", null);
__decorate([
    (0, common_1.Post)("buy-all"),
    (0, serializable_decorator_1.Serializable)(transfer_all_response_entity_1.TransactionsResponseEntity),
    (0, swagger_1.ApiOperation)({
        summary: "Buy SPL tokens",
        description: "This method buys SPL tokens from all accounts, based on provided data",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "SPL tokens buy started!",
        type: transfer_all_response_entity_1.TransactionsResponseEntity,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [buy_all_dto_1.BuyAllSPLDto]),
    __metadata("design:returntype", Promise)
], SolanaTokenController.prototype, "buyAll", null);
__decorate([
    (0, common_1.Put)("transfer-all"),
    (0, serializable_decorator_1.Serializable)(transfer_all_response_entity_1.TransactionsResponseEntity),
    (0, swagger_1.ApiOperation)({
        summary: "Transfer all SPL tokens to defined address",
        description: "This method transfers all SPL tokens to defined address. EVERYONE WILL BE KNOW WHO IS THE RECIPIENT AND WHAT HAPPENED",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "SPL tokens transfer started!",
        type: transfer_all_response_entity_1.TransactionsResponseEntity,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transfer_all_dto_1.TransferAllDto]),
    __metadata("design:returntype", Promise)
], SolanaTokenController.prototype, "transferAll", null);
__decorate([
    (0, common_1.Delete)("sell-all"),
    (0, serializable_decorator_1.Serializable)(transfer_all_response_entity_1.TransactionsResponseEntity),
    (0, swagger_1.ApiOperation)({
        summary: "Sell all SPL tokens",
        description: "This method sells all SPL tokens, based on provided data",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "SPL tokens sell started!",
        type: transfer_all_response_entity_1.TransactionsResponseEntity,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sell_all_dto_1.SellAllSPLDto]),
    __metadata("design:returntype", Promise)
], SolanaTokenController.prototype, "sellAll", null);
exports.SolanaTokenController = SolanaTokenController = SolanaTokenController_1 = __decorate([
    (0, controller_decorator_1.Controller)("spl", {
        tags: ["spl-token"],
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        app_service_1.AppService,
        solana_token_service_1.SolanaTokenService,
        accounts_service_1.AccountsService,
        event_emitter_1.EventEmitter2])
], SolanaTokenController);
