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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsSolanaController = void 0;
const controller_decorator_1 = require("../../@core/decorators/controller.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const web3_js_1 = require("@solana/web3.js");
const buy_token_dto_1 = require("../dtos/buy-token.dto");
const accounts_service_1 = require("../services/accounts.service");
const solana_token_service_1 = require("../../solana-token/solana-token.service");
const bs58 = __importStar(require("bs58"));
const serializable_decorator_1 = require("../../@core/decorators/serializable.decorator");
const transaction_entity_1 = require("../entities/transaction.entity");
const sell_token_dto_1 = require("../dtos/sell-token.dto");
const event_emitter_1 = require("@nestjs/event-emitter");
const solana_events_1 = require("../../solana/events/solana.events");
const transfer_token_dto_1 = require("../dtos/transfer-token.dto");
let AccountsSolanaController = class AccountsSolanaController {
    constructor(solanaTokenService, eventEmitter, accountsService) {
        this.solanaTokenService = solanaTokenService;
        this.eventEmitter = eventEmitter;
        this.accountsService = accountsService;
    }
    async buyToken(walletId, payload) {
        const { solAmount, slippagePercent, priorityMicroLamptorsFee } = payload;
        const account = await this.accountsService.findOne(walletId);
        const secretKey = await this.accountsService.getSecretKey(account.id);
        const wallet = web3_js_1.Keypair.fromSecretKey(bs58.decode(secretKey));
        const txHash = await this.solanaTokenService.buy(wallet, solAmount, slippagePercent, priorityMicroLamptorsFee);
        // Emit event
        this.eventEmitter.emit(solana_events_1.SolanaTxCreatedEvent.id, new solana_events_1.SolanaTxCreatedEvent({
            txHash,
            signerIds: [walletId],
        }));
        await this.accountsService.update(account.id, {
            lastBuyAt: new Date(),
        });
        return {
            txHash,
        };
    }
    async sellToken(walletId, payload) {
        const { tokenAmount, slippagePercent, skipLimit, priorityMicroLamptorsFee, } = payload;
        const account = await this.accountsService.findOne(walletId);
        const secretKey = await this.accountsService.getSecretKey(account.id);
        const wallet = web3_js_1.Keypair.fromSecretKey(bs58.decode(secretKey));
        const txHash = await this.solanaTokenService.sell(wallet, tokenAmount, slippagePercent, skipLimit, priorityMicroLamptorsFee);
        // Emit event
        this.eventEmitter.emit(solana_events_1.SolanaTxCreatedEvent.id, new solana_events_1.SolanaTxCreatedEvent({
            txHash,
            signerIds: [walletId],
        }));
        await this.accountsService.update(account.id, {
            lastSellAt: new Date(),
        });
        return {
            txHash,
        };
    }
    async transferToken(accountId, payload) {
        const { percent, recipient, priorityMicroLamptorsFee } = payload;
        const account = await this.accountsService.findOne(accountId);
        if (!account) {
            throw new common_1.BadRequestException(`Account with id ${accountId} not found`);
        }
        const secretKey = await this.accountsService.getSecretKey(account.id);
        const txHash = await this.solanaTokenService.transfer(web3_js_1.Keypair.fromSecretKey(bs58.decode(secretKey)), recipient, percent, priorityMicroLamptorsFee);
        // Emit event
        this.eventEmitter.emit(solana_events_1.SolanaTxCreatedEvent.id, new solana_events_1.SolanaTxCreatedEvent({
            txHash,
            signerIds: [account.publicKey],
        }));
        return {
            txHash,
        };
    }
};
exports.AccountsSolanaController = AccountsSolanaController;
__decorate([
    (0, common_1.Post)("buy"),
    (0, serializable_decorator_1.Serializable)(transaction_entity_1.SolanaTransactionEntity),
    (0, swagger_1.ApiOperation)({
        summary: "Buy SPL tokens",
        description: "Buy token for some amount of SOL",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Transaction",
        type: transaction_entity_1.SolanaTransactionEntity,
    }),
    __param(0, (0, common_1.Param)("accountId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, buy_token_dto_1.BuyTokenDto]),
    __metadata("design:returntype", Promise)
], AccountsSolanaController.prototype, "buyToken", null);
__decorate([
    (0, common_1.Delete)("sell"),
    (0, serializable_decorator_1.Serializable)(transaction_entity_1.SolanaTransactionEntity),
    (0, swagger_1.ApiOperation)({
        summary: "Sell SPL tokens",
        description: "Sell token for some amount of SOL",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Transaction",
        type: transaction_entity_1.SolanaTransactionEntity,
    }),
    __param(0, (0, common_1.Param)("accountId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sell_token_dto_1.SellTokenDto]),
    __metadata("design:returntype", Promise)
], AccountsSolanaController.prototype, "sellToken", null);
__decorate([
    (0, common_1.Put)("transfer"),
    (0, serializable_decorator_1.Serializable)(transaction_entity_1.SolanaTransactionEntity),
    (0, swagger_1.ApiOperation)({
        summary: "Transfer SPL tokens",
        description: "Transfer SPL tokens to defined address",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "SPL tokens transfer started!",
        type: transaction_entity_1.SolanaTransactionEntity,
    }),
    __param(0, (0, common_1.Param)("accountId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, transfer_token_dto_1.TransferSplTokenDto]),
    __metadata("design:returntype", Promise)
], AccountsSolanaController.prototype, "transferToken", null);
exports.AccountsSolanaController = AccountsSolanaController = __decorate([
    (0, controller_decorator_1.Controller)("accounts/:accountId/spl", {
        tags: ["spl-token"],
    }),
    __metadata("design:paramtypes", [solana_token_service_1.SolanaTokenService,
        event_emitter_1.EventEmitter2,
        accounts_service_1.AccountsService])
], AccountsSolanaController);
