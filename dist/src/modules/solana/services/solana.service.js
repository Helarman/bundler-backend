"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SolanaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const web3_js_1 = require("@solana/web3.js");
const app_service_1 = require("../../../app.service");
const spl_token_1 = require("@solana/spl-token");
const prisma_service_1 = require("../../../prisma.service");
const solana_provider_service_1 = require("./solana-provider.service");
const solana_1 = require("../../@core/solana");
let SolanaService = SolanaService_1 = class SolanaService extends solana_provider_service_1.SolanaProviderService {
    constructor(configService, appService, db) {
        super(configService);
        this.appService = appService;
        this.db = db;
        this.logger = new common_1.Logger(SolanaService_1.name);
    }
    async isTokenAccountExist(wallet) {
        const config = await this.appService.getConfig();
        if (!config) {
            throw new common_1.InternalServerErrorException("App config not found");
        }
        const tokenAccount = await solana_1.Solana.getWalletTokenAccount(wallet, new web3_js_1.PublicKey(config.tokenId));
        if (!tokenAccount) {
            throw new common_1.InternalServerErrorException("Token account not found");
            return false;
        }
        try {
            const info = await this.connection.getAccountInfo(tokenAccount);
            return !!info;
        }
        catch (error) { }
        return false;
    }
    async getTokenPublicKey() {
        const config = await this.appService.getConfig();
        if (!config || config.tokenId.length < 10) {
            throw new common_1.InternalServerErrorException("App config not found");
        }
        return config.tokenId;
    }
    async getToken() {
        const config = await this.appService.getConfig();
        if (!config || config.tokenId.length < 10) {
            throw new common_1.InternalServerErrorException("App config not found");
        }
        const publicKey = new web3_js_1.PublicKey(config.tokenId);
        return {
            publicKey,
            mint: await (0, spl_token_1.getMint)(this.connection, publicKey),
        };
    }
    async transferSolana(owner, recipient, amount, priorityMicroLamptorsFee, ignoreRecipientNotFound) {
        const recipientInfo = await this.connection.getAccountInfo(recipient);
        if (!recipientInfo && !ignoreRecipientNotFound) {
            throw new common_1.BadRequestException("Recipient account not found");
        }
        const lamports = BigInt(Math.floor(amount * web3_js_1.LAMPORTS_PER_SOL));
        const instructions = [
            web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
                units: 5000,
            }),
            ...(priorityMicroLamptorsFee
                ? [
                    web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: priorityMicroLamptorsFee,
                    }),
                ]
                : []),
            web3_js_1.SystemProgram.transfer({
                fromPubkey: owner.publicKey,
                toPubkey: recipient,
                lamports,
            }),
        ];
        const blockHash = await this.connection.getLatestBlockhash("finalized");
        const transaction = new web3_js_1.VersionedTransaction(new web3_js_1.TransactionMessage({
            payerKey: owner.publicKey,
            recentBlockhash: blockHash.blockhash,
            instructions,
        }).compileToV0Message());
        transaction.sign([owner]);
        const txHash = await this.connection.sendTransaction(transaction);
        return txHash;
    }
    /**
     * Get signatures for all tx hashes with chunking implementation
     * @param txHashes Tx hashes to get signatures for
     * @param chunkSize Chunk size
     * @param rpcUrl RPC url (by default Solana mainnet)
     * @returns
     */
    async getTxsStatuses({ txHashes, connection = new web3_js_1.Connection(solana_provider_service_1.SolanaProviderService.prodRpcUrl), chunkSize = 256, }) {
        const chunkedTxHashes = [];
        const signatures = [];
        for (let i = 0; i < txHashes.length; i += chunkSize) {
            chunkedTxHashes.push(txHashes.slice(i, i + chunkSize));
        }
        for (const chunk of chunkedTxHashes) {
            const { value: chunkSignatures } = await connection.getSignatureStatuses(chunk);
            const validSignatures = chunkSignatures.filter((sig) => sig !== null);
            signatures.push(...validSignatures);
        }
        return txHashes.reduce((acc, txHash, index) => {
            const status = signatures?.[index];
            return [
                ...acc,
                {
                    txHash,
                    status: status ?? null,
                },
            ];
        }, []);
    }
    /**
     * Gets info about accounts with RPC request and chunking implementation
     * @param accountIds Ids of the accounts to get info
     * @returns
     */
    async getAccountsInfo({ accountIds, connection = new web3_js_1.Connection(solana_provider_service_1.SolanaProviderService.prodRpcUrl), commitment, chunkSize = 100, }) {
        const chunkedAccounts = [];
        const accountsInfo = accountIds.reduce((acc, curr) => {
            acc[curr] = null;
            return acc;
        }, {});
        for (let i = 0; i < accountIds.length; i += chunkSize) {
            chunkedAccounts.push(accountIds.slice(i, i + chunkSize));
        }
        /**
         * We need chunking because getMultipleAccountsInfo have limitations
         * For solana mainnet we can't get more than 100 accounts at once
         * At free tier of Quicknode only 5 accounts can be requested at once
         */
        for (const chunk of chunkedAccounts) {
            const chunkInfo = await connection.getMultipleAccountsInfo(chunk.map((a) => new web3_js_1.PublicKey(a)), commitment);
            for (let i = 0; i < chunk.length; i++) {
                const accountId = chunk[i];
                const info = chunkInfo?.[i];
                if (!info)
                    continue;
                accountsInfo[accountId] = info;
            }
        }
        return Object.entries(accountsInfo).map(([accountId, info]) => ({
            accountId,
            info,
        }));
    }
};
exports.SolanaService = SolanaService;
exports.SolanaService = SolanaService = SolanaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        app_service_1.AppService,
        prisma_service_1.PrismaService])
], SolanaService);
