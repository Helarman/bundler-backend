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
var SolanaDcaJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDcaJob = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const client_1 = require("@prisma/client");
const encryption_service_1 = require("../../encryption/encryption.service");
const prisma_service_1 = require("../../../prisma.service");
const bs58 = __importStar(require("bs58"));
const web3_js_1 = require("@solana/web3.js");
const solana_token_service_1 = require("../../solana-token/solana-token.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const solana_events_1 = require("../../solana/events/solana.events");
const solana_transactions_service_1 = require("../../solana/services/solana-transactions.service");
/**
 * @deprecated
 */
let SolanaDcaJob = SolanaDcaJob_1 = class SolanaDcaJob {
    constructor(txService, eventEmitter, prismaService, encryptService, solanaTokenService) {
        this.txService = txService;
        this.eventEmitter = eventEmitter;
        this.prismaService = prismaService;
        this.encryptService = encryptService;
        this.solanaTokenService = solanaTokenService;
        this.logger = new common_1.Logger(SolanaDcaJob_1.name);
        this.processingPoolIds = new Set();
    }
    async getAccounts() {
        const ongoingSignerIds = await this.txService.getOngoingSignerIds();
        return await this.prismaService.dcaSolanaAccount.findMany({
            where: {
                isActive: true,
                account: {
                    publicKey: {
                        notIn: ongoingSignerIds,
                    },
                    isBalanceSynced: true,
                    isTokenBalanceSynced: true,
                },
            },
            include: {
                account: {
                    select: {
                        publicKey: true,
                        balance: true,
                        tokenBalance: true,
                        secretKey: true,
                    },
                },
            },
        });
    }
    async processAccount(dcaAccount) {
        const { account, minDelayBetweenTxsInSeconds, maxDelayBetweenTxsInSeconds, reserveSolAmount, reserveTokenAmount, balanceUsagePercent, } = dcaAccount;
        if (this.processingPoolIds.has(account.publicKey))
            return;
        this.processingPoolIds.add(account.publicKey);
        const transaction = await this.txService.getLastForSigner(account.publicKey);
        let nextTxType = client_1.DcaTxType.BUY;
        const remove = () => this.processingPoolIds.delete(account.publicKey);
        if (transaction) {
            if (!transaction.isConfirmed && !transaction.isFailed) {
                remove();
                return;
            }
            if (new Date(dcaAccount.allowNextAt).getTime() > Date.now()) {
                remove();
                return;
            } // Is not time to execute
            if (transaction.isConfirmed) {
                nextTxType =
                    dcaAccount.lastTxType === client_1.DcaTxType.BUY
                        ? client_1.DcaTxType.SELL
                        : client_1.DcaTxType.BUY;
            }
            else {
                nextTxType = dcaAccount.lastTxType;
            }
        }
        // Check if account have enough SOL to execute transaction
        if (account.balance < reserveSolAmount && nextTxType === client_1.DcaTxType.BUY) {
            this.logger.debug(`${account.publicKey} have only ${account.balance} SOL, reserve is ${reserveSolAmount} so we change tx type to SELL`);
            nextTxType = client_1.DcaTxType.SELL;
        }
        if (account.tokenBalance < 100 && nextTxType === client_1.DcaTxType.SELL) {
            this.logger.debug(`No tokens to sell. Skipping`);
            remove();
            return;
        }
        const delayInSeconds = Math.floor(Math.random() *
            (maxDelayBetweenTxsInSeconds - minDelayBetweenTxsInSeconds) +
            minDelayBetweenTxsInSeconds);
        const allowNextAt = new Date(Date.now() + delayInSeconds * 1000);
        this.logger.debug(`${account.publicKey} do ${nextTxType} with delay ${delayInSeconds} seconds so allow next at ${allowNextAt.toISOString()}`);
        try {
            const owner = web3_js_1.Keypair.fromSecretKey(bs58.decode(this.encryptService.decrypt(account.secretKey)));
            let solAmount = 0;
            let tokenAmount = 0;
            let txHash = "";
            if (nextTxType === client_1.DcaTxType.BUY) {
                solAmount = account.balance - reserveSolAmount;
                txHash = await this.solanaTokenService.buy(owner, solAmount);
            }
            if (nextTxType === client_1.DcaTxType.SELL) {
                const availableTokenBalance = account.tokenBalance - reserveTokenAmount;
                tokenAmount = Math.floor((availableTokenBalance * balanceUsagePercent) / 100);
                txHash = await this.solanaTokenService.sell(owner, tokenAmount);
            }
            this.logger.verbose(`Sended ${nextTxType} tx ${txHash} with ${solAmount} SOL and ${tokenAmount} tokens`);
            await this.prismaService.dcaSolanaAccount.update({
                where: { accountId: account.publicKey },
                data: {
                    lastTxType: nextTxType,
                    allowNextAt,
                },
            });
            this.eventEmitter.emit(solana_events_1.SolanaTxCreatedEvent.id, new solana_events_1.SolanaTxCreatedEvent({
                txHash,
                signerIds: [account.publicKey],
            }));
        }
        catch (error) {
            this.logger.error(error);
        }
        remove();
    }
    async loop() {
        const accounts = await this.getAccounts();
        // Promise.allSettled(accounts);
        // Promise.allSettled(
        //   accounts.map((account) =>
        //     this.processAccount(account as GetAccountsResponseItem),
        //   ),
        // );
        for (const account of accounts) {
            await this.processAccount(account);
        }
    }
};
exports.SolanaDcaJob = SolanaDcaJob;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SolanaDcaJob.prototype, "loop", null);
exports.SolanaDcaJob = SolanaDcaJob = SolanaDcaJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [solana_transactions_service_1.SolanaTransactionsService,
        event_emitter_1.EventEmitter2,
        prisma_service_1.PrismaService,
        encryption_service_1.EncryptionService,
        solana_token_service_1.SolanaTokenService])
], SolanaDcaJob);
