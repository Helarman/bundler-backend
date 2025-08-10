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
var SolanaTokenService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTokenService = exports.METADATA_SEED = exports.BONDING_CURVE_SEED = exports.MINT_AUTHORITY_SEED = exports.GLOBAL_ACCOUNT_SEED = void 0;
const solana_1 = require("../@core/solana");
const pump_fun_1 = require("../@core/solana/pump.fun");
const token_1 = require("../@core/solana/pump.fun/token");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const accounts_service_1 = require("../accounts/services/accounts.service");
const app_events_1 = require("../../app.events");
const app_service_1 = require("../../app.service");
const solana_provider_service_1 = require("../solana/services/solana-provider.service");
const solana_service_1 = require("../solana/services/solana.service");
const bs58 = __importStar(require("bs58"));
const anchor_1 = require("@coral-xyz/anchor");
const sleep_1 = require("../@core/utils/sleep");
exports.GLOBAL_ACCOUNT_SEED = "global";
exports.MINT_AUTHORITY_SEED = "mint-authority";
exports.BONDING_CURVE_SEED = "bonding-curve";
exports.METADATA_SEED = "metadata";
let SolanaTokenService = SolanaTokenService_1 = class SolanaTokenService extends solana_provider_service_1.SolanaProviderService {
    constructor(configService, appService, solanaService, accountsService) {
        super(configService);
        this.appService = appService;
        this.solanaService = solanaService;
        this.accountsService = accountsService;
        this.logger = new common_1.Logger(SolanaTokenService_1.name);
        this.token = null;
        this.tokenData = null;
    }
    async onModuleInit() {
        await super.onModuleInit();
        await this.syncTokenData();
    }
    async onAppConfigUpdated() {
        this.token = null;
    }
    async syncTokenData() {
        try {
            const token = await this.getToken();
            this.tokenData = await token.getData();
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    /**
     * Get token instance
     * @returns
     */
    async getToken() {
        if (this.token)
            return this.token;
        const config = await this.appService.getConfig();
        this.logger.debug(`Parsing token data for cache it then`);
        const token = new token_1.PumpFunToken(this.connection, config.tokenId, {
            id: config.bondingCurveId,
            associatedId: config.associatedBondingCurveId,
        });
        // to cache it
        await token.getDecimals();
        this.token = token;
        return token;
    }
    async calculateMinSolOutput(tokenAmount, slipPagePercent = 5) {
        const slippageDecimals = slipPagePercent / 100;
        const solAmount = await this.tokenToSolAmount(tokenAmount);
        const minSolOuput = solAmount * (1 - slippageDecimals);
        this.logger.debug(`Calculated min sol output ${minSolOuput} for ${tokenAmount} token amount with slippage ${slipPagePercent}%`);
        return minSolOuput;
    }
    async solToTokenAmount(solAmount = 1) {
        const token = await this.getToken();
        const decimals = await token.getDecimals();
        if (!this.tokenData) {
            throw new Error('tokenData is null');
        }
        const { virtual_token_reserves, virtual_sol_reserves } = this.tokenData;
        const tokenAmount = (solAmount * web3_js_1.LAMPORTS_PER_SOL * virtual_token_reserves) /
            virtual_sol_reserves /
            10 ** decimals;
        pump_fun_1.PumpFun.logger.debug(`Converted ${solAmount} SOL amount to ${tokenAmount} token amount`);
        return tokenAmount;
    }
    async tokenToSolAmount(tokenAmount = 1) {
        const token = await this.getToken();
        const decimals = await token.getDecimals();
        if (!this.tokenData) {
            throw new Error('tokenData is null');
        }
        const { virtual_token_reserves, virtual_sol_reserves } = this.tokenData;
        const tokenFullAmount = tokenAmount * 10 ** decimals;
        const solAmountPerToken = virtual_sol_reserves / web3_js_1.LAMPORTS_PER_SOL / virtual_token_reserves;
        this.logger.debug(`Converted ${tokenAmount} token amount to ${tokenFullAmount * solAmountPerToken} SOL amount`);
        return tokenFullAmount * solAmountPerToken;
    }
    /**
     * Get balance of the tokens on wallet
     * @param walletId Id of the wallet
     * @returns
     */
    async getBalance(walletId) {
        const token = await this.getToken();
        return token.getSPLBalance(new web3_js_1.PublicKey(walletId));
    }
    async _sendTxWithRetry(connection, transaction, retryDelay, maxRetries = 15) {
        let txHash = "";
        for (const index of Array.from({ length: maxRetries })) {
            index;
            try {
                txHash = await connection.sendRawTransaction(transaction.serialize(), {
                    skipPreflight: true,
                });
            }
            catch (error) {
                this.logger.error(error);
            }
            if (txHash.indexOf("111111111111111111") > -1) {
                txHash = "";
            }
            if (txHash.length > 0)
                break;
            await (0, sleep_1.sleep)(retryDelay);
        }
        return txHash;
    }
    async _buyTokenFromAccounts(connection, commitment, provider, _blockHash, mint, bondingCurve, accounts) {
        const globalAccount = await pump_fun_1.PumpFun.getGlobalAccount(connection);
        const blockHash = await connection.getLatestBlockhash(commitment);
        const transactions = [];
        for (const { buyer, solAmount } of accounts) {
            const slippagePercent = 50;
            const slippageDecimals = slippagePercent / 100;
            const tokenAmount = globalAccount.getInitialBuyPrice(BigInt(Math.floor(solAmount * web3_js_1.LAMPORTS_PER_SOL)));
            const tokenAmountWithSlippage = BigInt(Math.max(Math.floor(Number(tokenAmount) - Number(tokenAmount) * slippageDecimals), 0));
            this.logger.log(`Spending ${solAmount} SOL for ${tokenAmountWithSlippage} tokens, originally ${tokenAmount} (${slippagePercent}% slippage)`);
            const tokenAccoount = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, buyer.publicKey, true);
            const transaction = new web3_js_1.VersionedTransaction(new web3_js_1.TransactionMessage({
                payerKey: buyer.publicKey,
                recentBlockhash: blockHash.blockhash,
                instructions: [
                    web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
                        units: 62000,
                    }),
                    web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: 1200000,
                    }),
                    (0, spl_token_1.createAssociatedTokenAccountInstruction)(buyer.publicKey, tokenAccoount, buyer.publicKey, mint),
                    await pump_fun_1.PumpFun.buyTokenInstruction(provider, buyer, mint, bondingCurve, tokenAmountWithSlippage, solAmount),
                ],
            }).compileToV0Message());
            transaction.sign([buyer]);
            transactions.push(transaction);
        }
        const txHashes = [];
        await Promise.allSettled(transactions.map((transaction) => new Promise(async (resolve) => {
            try {
                const txHash = await connection.sendTransaction(transaction, {
                    skipPreflight: true,
                });
                this.logger.log(`Buy tx hash: ${txHash}`);
                txHashes.push(txHash);
            }
            catch (error) {
                this.logger.error(error);
            }
            resolve(true);
        })));
        return txHashes;
    }
    async waitForToken(connection, commitment, mint) {
        return new Promise((resolve) => {
            const intervalId = setInterval(async () => {
                const mintAccountInfo = await connection.getAccountInfo(mint, commitment);
                if (mintAccountInfo && mintAccountInfo?.data) {
                    const data = spl_token_1.MintLayout.decode(mintAccountInfo?.data);
                    if (data?.isInitialized) {
                        clearInterval(intervalId);
                        resolve(true);
                    }
                }
            }, 50);
        });
    }
    async waitForBlockSlot(connection, commitment, blockSlot) {
        return await new Promise((resolve) => {
            const intervalId = setInterval(async () => {
                const blockHash = await connection.getLatestBlockhashAndContext(commitment);
                if (blockHash.context.slot >= blockSlot) {
                    clearInterval(intervalId);
                    resolve(blockHash);
                }
            }, 100);
        });
    }
    async create(creator, dto, file, buyers) {
        const { name, symbol } = dto;
        const commitment = "confirmed";
        const connection = new web3_js_1.Connection(this.config.rpcUrl, commitment);
        const provider = new anchor_1.AnchorProvider(connection, new anchor_1.Wallet(creator), {
            commitment,
            skipPreflight: true,
        });
        const accounts = await this.accountsService.findAll({
            withSecretKeys: true,
        });
        const buyerAccounts = [];
        const accountIdToAccount = new Map(accounts.map((account) => [account.publicKey, account]));
        for (const { address, solAmount } of buyers) {
            try {
                const account = accountIdToAccount.get(address);
                if (!account) {
                    throw new common_1.BadRequestException(`Account with id ${address} not found`);
                }
                if (account.balance < solAmount) {
                    throw new common_1.BadRequestException(`Insufficient balance for account ${address}. Only ${account.balance} SOL available but ${solAmount} required`);
                }
                const buyer = web3_js_1.Keypair.fromSecretKey(bs58.decode(account.secretKey));
                buyerAccounts.push({
                    buyer,
                    solAmount,
                });
            }
            catch (error) {
                this.logger.error(error);
            }
        }
        const mint = web3_js_1.Keypair.generate();
        const bondingCurve = pump_fun_1.PumpFun.getMintBondingCurve(mint.publicKey);
        const metadataUri = await pump_fun_1.PumpFun.putTokenMetadata(dto, file);
        const mintBlockHash = await connection.getLatestBlockhashAndContext(commitment);
        const transaction = new web3_js_1.VersionedTransaction(new web3_js_1.TransactionMessage({
            payerKey: creator.publicKey,
            recentBlockhash: mintBlockHash.value.blockhash,
            instructions: [
                web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
                    units: 250000,
                }),
                web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                    microLamports: 1900000,
                }),
                await pump_fun_1.PumpFun.createTokenInstruction(provider, creator, mint, bondingCurve, name, symbol, metadataUri),
            ],
        }).compileToV0Message());
        transaction.sign([creator, mint]);
        const mintTxHash = await connection.sendTransaction(transaction, {
            skipPreflight: true,
        });
        this.logger.log(`[${mintBlockHash.context.slot}] Mint tx hash: ${mintTxHash}`);
        const verifiedBlockHash = await this.waitForBlockSlot(connection, commitment, mintBlockHash.context.slot + 5);
        this.logger.log(`[${verifiedBlockHash.context.slot}] Mint is verified`);
        const txHashes = [mintTxHash];
        const buyTxHashes = await this._buyTokenFromAccounts(connection, commitment, provider, verifiedBlockHash.value, mint.publicKey, bondingCurve, buyerAccounts);
        txHashes.push(...buyTxHashes);
        return {
            mint,
            bondingCurve,
            associatedBondingCurve: (0, spl_token_1.getAssociatedTokenAddressSync)(mint.publicKey, bondingCurve, true),
            txHashes,
        };
    }
    /**
     * Buy tokens for input solana amount
     * @param wallet
     * @param solAmount
     * @param slipPagePercentage
     * @returns
     */
    async buy(wallet, solAmount, slipPagePercentage, priorityMicroLamptorsFee) {
        const token = await this.getToken();
        const account = await this.accountsService.findOne(wallet.publicKey.toBase58());
        if (account.balance < solAmount) {
            throw new common_1.BadRequestException("Insufficient balance");
        }
        let createAssociatedTokenAccount = false;
        const tokenAccount = await solana_1.Solana.getWalletTokenAccount(wallet.publicKey, new web3_js_1.PublicKey(token.tokenId));
        const isTokenAccountInitialized = await this.accountsService.isTokenAccountInitialized(tokenAccount.toBase58());
        // Save data to the database
        if (!isTokenAccountInitialized) {
            if (!tokenAccount) {
                throw Error("Account not found");
            }
            const info = await this.connection.getAccountInfo(tokenAccount);
            if (!info) {
                createAssociatedTokenAccount = true;
            }
            else {
                await this.accountsService.update(wallet.publicKey.toBase58(), {
                    tokenAccountId: tokenAccount.toBase58(),
                    isTokenAccountInitialized: true,
                });
            }
        }
        return token.buy(wallet, solAmount, slipPagePercentage, createAssociatedTokenAccount, priorityMicroLamptorsFee);
    }
    async getSPLBalancePercentageFromDb(wallet, percent) {
        const percentDecimals = percent / 100;
        const account = await this.accountsService.findOne(wallet.publicKey.toBase58());
        if (!account)
            throw new Error("Account not found");
        return account.tokenBalance * percentDecimals;
    }
    async sell(wallet, tokenAmount, slipPagePercentage, skipLimit, priorityMicroLamptorsFee) {
        const config = await this.appService.getConfig();
        const token = await this.getToken();
        let sellTokenAmount = tokenAmount;
        this.logger.debug(`Selling ${tokenAmount} of tokens for wallet [${wallet.publicKey.toBase58()}]`);
        if (!skipLimit) {
            // For example we available to sell only half (50%) of the tokens
            // const maxTokensToSell = await token.getSPLBalancePercentage(
            //   wallet,
            //   config.balanceUsagePercent,
            // );
            const maxTokensToSell = await this.getSPLBalancePercentageFromDb(wallet, config.balanceUsagePercent);
            this.logger.debug(`Max tokens to sell for wallet [${wallet.publicKey.toBase58()}]: ${maxTokensToSell}`);
            sellTokenAmount = Math.min(sellTokenAmount, maxTokensToSell);
            const sellFromMaxPercentage = (sellTokenAmount * 100) / maxTokensToSell;
            if (sellTokenAmount !== tokenAmount) {
                this.logger.debug(`[REWRITE] Selling ${sellTokenAmount} (${sellFromMaxPercentage}% from max) of tokens`);
            }
        }
        else {
            this.logger.debug("Skipping limit of max tokens to sell");
        }
        const precalculatedMinSolOutput = await this.calculateMinSolOutput(sellTokenAmount, slipPagePercentage);
        return token.sell(wallet, sellTokenAmount, slipPagePercentage, priorityMicroLamptorsFee, precalculatedMinSolOutput);
    }
    async transferAllFromManyToOne(feePayer, holders, addressId, priorityMicroLamptorsFee) {
        const token = await this.getToken();
        const txHash = await token.transferAllFromManyToOne(feePayer, holders, addressId, priorityMicroLamptorsFee);
        return txHash;
    }
    async transfer(wallet, addressId, amountPercent, priorityMicroLamptorsFee) {
        const token = await this.getToken();
        const txHash = await token.transfer(wallet, addressId, amountPercent, priorityMicroLamptorsFee);
        return txHash;
    }
};
exports.SolanaTokenService = SolanaTokenService;
__decorate([
    (0, event_emitter_1.OnEvent)(app_events_1.AppConfigUpdatedEvent.id),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SolanaTokenService.prototype, "onAppConfigUpdated", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SolanaTokenService.prototype, "syncTokenData", null);
exports.SolanaTokenService = SolanaTokenService = SolanaTokenService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        app_service_1.AppService,
        solana_service_1.SolanaService,
        accounts_service_1.AccountsService])
], SolanaTokenService);
