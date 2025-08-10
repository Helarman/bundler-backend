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
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const web3_js_1 = require("@solana/web3.js");
const encryption_service_1 = require("../../encryption/encryption.service");
const solana_dca_service_1 = require("../services/solana-dca.service");
const solana_events_1 = require("../../solana/events/solana.events");
const solana_service_1 = require("../../solana/services/solana.service");
const bs58 = __importStar(require("bs58"));
const solana_token_service_1 = require("../../solana-token/solana-token.service");
const app_service_1 = require("../../../app.service");
const sleep_1 = require("../../@core/utils/sleep");
const solana_transactions_service_1 = require("../../solana/services/solana-transactions.service");
const client_1 = require("@prisma/client");
const random_1 = require("../../@core/utils/random");
let SolanaDcaJob = SolanaDcaJob_1 = class SolanaDcaJob {
    constructor(txService, appService, eventEmitter, service, solanaService, solanaTokenService, encryptService) {
        this.txService = txService;
        this.appService = appService;
        this.eventEmitter = eventEmitter;
        this.service = service;
        this.solanaService = solanaService;
        this.solanaTokenService = solanaTokenService;
        this.encryptService = encryptService;
        this.logger = new common_1.Logger(SolanaDcaJob_1.name);
        /**
         * Set of account ids that are processing
         */
        this.processingAccountIds = new Set();
    }
    async onModuleInit() { }
    async _getAccounts() {
        const accounts = await this.service.getLoopAccounts();
        return accounts.map((dcaAccount) => ({
            ...dcaAccount,
            secretKey: bs58.decode(this.encryptService.decrypt(dcaAccount.account.secretKey)),
        }));
    }
    /**
     * Checks if the account is valid for buy
     * @param dcaAccount
     * @returns
     */
    async _isValidForBuy(dcaAccount) {
        const minSolAmountToSpend = 0.001;
        const { account, reserveTokenAmount, reserveSolAmount, minTokenPrice, maxTokenPrice, canBuy, maxTokenAmount, bumpOperateSolAmount, } = dcaAccount;
        if (!canBuy)
            return false;
        const tokenBalanceMaxLimit = maxTokenAmount + reserveTokenAmount;
        const { solana_price_per_token } = this?.solanaTokenService?.tokenData ?? {
            solana_price_per_token: 0,
        };
        const solanaBalance = account.balance - reserveSolAmount;
        if (bumpOperateSolAmount &&
            bumpOperateSolAmount > 0 &&
            solanaBalance < bumpOperateSolAmount &&
            bumpOperateSolAmount !== 999) {
            this.logger.error(`Account ${account.publicKey} has not enough SOL for bump operation`);
            return false;
        }
        if (solanaBalance < minSolAmountToSpend) {
            this.logger.error(`Account ${account.publicKey} has not enough SOL to buy tokens`);
            return false;
        }
        if (account.tokenBalance >= tokenBalanceMaxLimit && maxTokenAmount !== 0) {
            this.logger.error(`Account ${account.publicKey} will overbuy token limit`);
            return false;
        }
        if (solana_price_per_token > maxTokenPrice) {
            this.logger.error(`Account ${account.publicKey} can't buy because price is too high`);
            return false;
        }
        if (solana_price_per_token <= minTokenPrice) {
            this.logger.error(`Account ${account.publicKey} can't buy because price is too low`);
            return false;
        }
        return true;
    }
    /**
     * Checks if the account is valid for sell
     * @param dcaAccount
     * @returns
     */
    async _isValidForSell(dcaAccount) {
        const { account, reserveTokenAmount, canSell, minTokenAmountPerSale } = dcaAccount;
        if (!canSell)
            return false;
        const tokenBalance = account.tokenBalance - reserveTokenAmount;
        if (tokenBalance < minTokenAmountPerSale)
            return false;
        return true;
    }
    /**
     * Checks if the account can continue
     * @param dcaAccount
     * @returns
     */
    async _canContinue(dcaAccount) {
        const { isActive, allowNextAt } = dcaAccount;
        if (!isActive)
            return false;
        const lastTx = await this.txService.getLastForSigner(dcaAccount.accountId);
        if (lastTx) {
            const { isConfirmed, isFailed } = lastTx;
            if (!isConfirmed && !isFailed) {
                this.logger.debug(`Last tx is not confirmed or failed for ${dcaAccount.accountId}`);
                return false;
            }
            if (new Date(allowNextAt).getTime() > Date.now()) {
                this.logger.debug(`Last tx is not allowed to execute for ${dcaAccount.accountId} because it is not time to execute yet`);
                return false;
            }
        }
        return true;
    }
    /**
     * Gets the type of the next transaction
     * @param dcaAccount
     * @returns
     */
    async _getTypeForNextTransaction(dcaAccount) {
        let type = null;
        const isRandom = true;
        const lastTransactionType = dcaAccount?.lastTxType;
        const isBuyValid = await this._isValidForBuy(dcaAccount);
        const isSellValid = await this._isValidForSell(dcaAccount);
        if (!type &&
            dcaAccount.bumpOperateSolAmount > 0 &&
            !isBuyValid &&
            isSellValid) {
            type = client_1.DcaTxType.FULL_SELL;
        }
        if (!type && isRandom && isBuyValid && isSellValid) {
            // one or two
            const randomValue = (0, random_1.randomInt)(1, 2);
            if (randomValue === 1) {
                type = client_1.DcaTxType.BUY;
            }
            else {
                type = client_1.DcaTxType.SELL;
            }
            this.logger.debug(`Random number ${randomValue} so type is ${type}`);
        }
        // If last is BUY and SELL is valid - SELL
        if (!type && lastTransactionType === client_1.DcaTxType.BUY && isSellValid) {
            type = client_1.DcaTxType.SELL;
        }
        // If last is SELL and BUY is valid - BUY
        if (!type && lastTransactionType === client_1.DcaTxType.SELL && isBuyValid) {
            type = client_1.DcaTxType.BUY;
        }
        // If not defined and BUY is valid - BUY
        if (!type && isBuyValid) {
            type = client_1.DcaTxType.BUY;
        }
        // If not defined and SELL is valid - SELL
        if (!type && isSellValid) {
            type = client_1.DcaTxType.SELL;
        }
        return type;
    }
    /**
     * Gets the delay in seconds for the next transaction
     * @param dcaAccount
     * @returns
     */
    _getDelayInSeconds(dcaAccount) {
        const { minDelayBetweenTxsInSeconds, maxDelayBetweenTxsInSeconds } = dcaAccount;
        return Math.floor(Math.random() *
            (maxDelayBetweenTxsInSeconds - minDelayBetweenTxsInSeconds) +
            minDelayBetweenTxsInSeconds);
    }
    async _calculateBuyTokenSolAmount(dcaAccount) {
        const { account: { tokenBalance, balance }, maxTokenAmount, reserveTokenAmount, reserveSolAmount, bumpOperateSolAmount, } = dcaAccount;
        const availableSolBalance = balance - reserveSolAmount;
        const availableTokenBalance = tokenBalance - reserveTokenAmount;
        const maxAvailableToBuy = maxTokenAmount - availableTokenBalance;
        let solAmount = await this.solanaTokenService.tokenToSolAmount(maxAvailableToBuy);
        if (bumpOperateSolAmount && bumpOperateSolAmount > 0) {
            solAmount = bumpOperateSolAmount;
        }
        // Get the available SOL balance from provided values
        return Math.min(solAmount, availableSolBalance);
    }
    /**
     * Processes single account asynchronously
     * @param dcaAccount
     * @returns
     */
    async _processAccount(dcaAccount) {
        // const OPERATIONS_PER_SECOND = 3;
        const config = await this.appService.getConfig();
        if (this.processingAccountIds.has(dcaAccount.accountId))
            return;
        this.processingAccountIds.add(dcaAccount.accountId);
        await new Promise(async (resolve) => {
            try {
                // Check if the account can continue
                const canContinue = await this._canContinue(dcaAccount);
                if (!canContinue) {
                    resolve(true);
                    return;
                }
                const type = await this._getTypeForNextTransaction(dcaAccount);
                // If type is null - we can't continue
                if (!type) {
                    resolve(true);
                    return;
                }
                let solAmount = 0;
                let tokenAmount = 0;
                let txHash = "";
                const { account: { publicKey, tokenBalance }, secretKey, reserveTokenAmount, balanceUsagePercent, slippagePercent, bumpOperateSolAmount, } = dcaAccount;
                const owner = web3_js_1.Keypair.fromSecretKey(secretKey);
                const delayInSeconds = this._getDelayInSeconds(dcaAccount);
                const allowNextAt = new Date(Date.now() + delayInSeconds * 1000);
                if (type === client_1.DcaTxType.BUY && config) {
                    solAmount = await this._calculateBuyTokenSolAmount(dcaAccount);
                    txHash = await this.solanaTokenService.buy(owner, solAmount, slippagePercent, config.priorityMicroLamptorsFee);
                }
                if (type === client_1.DcaTxType.SELL || type === client_1.DcaTxType.FULL_SELL) {
                    // tokenAmount
                    const availableTokenBalance = tokenBalance - reserveTokenAmount;
                    if (!config) {
                        throw Error;
                    }
                    if (type === client_1.DcaTxType.FULL_SELL) {
                        tokenAmount = tokenBalance;
                    }
                    else if (bumpOperateSolAmount &&
                        bumpOperateSolAmount > 0 &&
                        type == client_1.DcaTxType.SELL) {
                        tokenAmount = await this.solanaTokenService.solToTokenAmount((bumpOperateSolAmount * balanceUsagePercent) / 100);
                    }
                    else {
                        tokenAmount = Math.floor((availableTokenBalance * balanceUsagePercent) / 100);
                    }
                    txHash = await this.solanaTokenService.sell(owner, tokenAmount, slippagePercent, true, config.priorityMicroLamptorsFee);
                }
                this.logger.verbose(`Sended ${type} tx ${txHash} with ${solAmount} SOL and ${tokenAmount} tokens`);
                await this.service.updateAccount(dcaAccount.accountId, {
                    lastTxType: type,
                    allowNextAt,
                });
                if (type === client_1.DcaTxType.BUY) {
                    await this.service.saveBuyDate(publicKey);
                }
                if (type === client_1.DcaTxType.SELL) {
                    await this.service.saveSellDate(publicKey);
                }
                this.eventEmitter.emit(solana_events_1.SolanaTxCreatedEvent.id, new solana_events_1.SolanaTxCreatedEvent({
                    txHash,
                    signerIds: [publicKey],
                }));
                // await sleep(1000 / OPERATIONS_PER_SECOND);
            }
            catch (error) {
                this.logger.error(error);
            }
            resolve(true);
        });
        this.processingAccountIds.delete(dcaAccount.accountId);
    }
    /**
     * Loop for handling DCA accounts
     */
    async loop() {
        // if (this.appService.isPanicSale()) {
        //   this.logger.debug("Panic sale is active, skipping");
        //   return;
        // }
        const accounts = await this._getAccounts();
        if (accounts.length === 0)
            return;
        this.logger.debug(`Processing ${accounts.length} accounts`);
        // Promise.allSettled(
        //   accounts.map((account) => this._processAccount(account)),
        // );
        for (const account of accounts) {
            await this._processAccount(account);
            await (0, sleep_1.sleep)(50);
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
        app_service_1.AppService,
        event_emitter_1.EventEmitter2,
        solana_dca_service_1.SolanaDcaService,
        solana_service_1.SolanaService,
        solana_token_service_1.SolanaTokenService,
        encryption_service_1.EncryptionService])
], SolanaDcaJob);
