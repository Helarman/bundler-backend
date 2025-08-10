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
var SolanaBlockhainSynchronizerJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaBlockhainSynchronizerJob = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const accounts_events_1 = require("../../accounts/events/accounts.events");
const accounts_service_1 = require("../../accounts/services/accounts.service");
const app_service_1 = require("../../../app.service");
const prisma_service_1 = require("../../../prisma.service");
const solana_dca_service_1 = require("../../solana-dca/services/solana-dca.service");
const solana_token_service_1 = require("../../solana-token/solana-token.service");
const solana_events_1 = require("../events/solana.events");
const solana_provider_service_1 = require("../services/solana-provider.service");
const solana_transactions_service_1 = require("../services/solana-transactions.service");
const solana_service_1 = require("../services/solana.service");
let SolanaBlockhainSynchronizerJob = SolanaBlockhainSynchronizerJob_1 = class SolanaBlockhainSynchronizerJob {
    constructor(dcaService, appService, txService, prismaService, solanaService, providerService, accountsService, tokenService, eventEmitter) {
        this.dcaService = dcaService;
        this.appService = appService;
        this.txService = txService;
        this.prismaService = prismaService;
        this.solanaService = solanaService;
        this.providerService = providerService;
        this.accountsService = accountsService;
        this.tokenService = tokenService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(SolanaBlockhainSynchronizerJob_1.name);
        /**
         *  Commitment level that will be used to listen for changes
         */
        this.commitment = "finalized";
    }
    async onApplicationBootstrap() {
        await this.prismaService.account.updateMany({
            data: {
                isBalanceSynced: false,
                isTokenBalanceSynced: false,
            },
        });
        this.synchonizeAccounts({ type: "all" });
    }
    async synchonizeAccounts(event) {
        const { type = "unsynced" } = event;
        const accounts = await this.accountsService.findAll();
        const requiredSyncAccounts = accounts.filter((a) => {
            if (type === "all")
                return true;
            return !a.isBalanceSynced || !a.isTokenBalanceSynced;
        });
        await this.syncByRpcRequest({
            accountIds: requiredSyncAccounts.map((a) => a.publicKey),
        });
    }
    /**
     * Handler for account change event
     * @param accountId Id of the account that was changed
     * @param accountInfo Account info that was changed
     * @returns void
     */
    async _onAccountChange({ accountId, info, }) {
        await this.accountsService.update(accountId, {
            ...(info?.lamports
                ? {
                    balance: info.lamports / web3_js_1.LAMPORTS_PER_SOL,
                }
                : {}),
            isBalanceSynced: true,
            syncedAt: new Date(),
        });
    }
    async _onTokenAccountChange({ accountId, tokenAccountId, info, }) {
        const isTokenAccountInitialized = info?.data && info?.data?.length > 0;
        if (!accountId && !tokenAccountId) {
            throw new Error("Account id or token account id is required");
        }
        if (!isTokenAccountInitialized) {
            return;
        }
        if (!info) {
            if (tokenAccountId) {
                await this.accountsService.updateByTokenAccount(tokenAccountId, {
                    isTokenBalanceSynced: true,
                });
                return;
            }
            if (accountId) {
                await this.accountsService.update(accountId, {
                    isBalanceSynced: true,
                });
                return;
            }
            return;
        }
        const token = await this.tokenService.getToken();
        const decimals = await token.getDecimals();
        const data = spl_token_1.AccountLayout.decode(info.data);
        if (!accountId) {
            accountId = data.owner.toBase58();
        }
        const tokenBalance = Number(data.amount) / 10 ** decimals;
        await this.accountsService.update(accountId, {
            tokenBalance,
            isTokenAccountInitialized: true,
            isTokenBalanceSynced: true,
            syncedAt: new Date(),
        });
    }
    /**
     * Handler for signature event
     * @param txHash Id of the transaction
     * @param result Result of the transaction
     * @param context Context of the transaction
     * @param signerId Id of the account that was signer of the transaction
     */
    async _onTxSignature({ txHash, status, signerIds, timeoutLimit = 30000, }) {
        const ongoingTx = await this.txService.get(txHash);
        if (ongoingTx && signerIds) {
            signerIds.push(...ongoingTx.signerIds);
            // Remove duplicates
            signerIds = [...new Set(signerIds)];
        }
        // If we have some error
        if (status?.err ||
            (ongoingTx &&
                new Date(ongoingTx.createdAt).getTime() + timeoutLimit <
                    new Date().getTime())) {
            this.logger.error(`Transaction ${txHash} failed`, status?.err);
            this.eventEmitter.emit(solana_events_1.SolanaTxFailedEvent.id, new solana_events_1.SolanaTxFailedEvent({
                txHash,
                signerIds,
            }));
            await this.txService.failTx(txHash);
            return;
        }
        if (status?.confirmationStatus &&
            (status.confirmationStatus === "finalized" ||
                (status.confirmationStatus === "processed" &&
                    this.commitment === "processed") ||
                (status.confirmationStatus === "confirmed" &&
                    this.commitment === "processed") ||
                (status.confirmationStatus === "confirmed" &&
                    this.commitment === "confirmed"))) {
            // Finalized!
            this.logger.debug(`Transaction ${txHash} is finalized!`);
            this.eventEmitter.emit(solana_events_1.SolanaTxSuccessEvent.id, new solana_events_1.SolanaTxSuccessEvent({
                txHash,
                signerIds,
            }));
            await this.txService.confirmTx(txHash);
            return;
        }
        await this.txService.update(txHash, {
            lastScannedAt: new Date(),
        });
    }
    _getTokenAddress(tokenId, publicKey) {
        return (0, spl_token_1.getAssociatedTokenAddressSync)(new web3_js_1.PublicKey(tokenId), new web3_js_1.PublicKey(publicKey), true, spl_token_1.TOKEN_PROGRAM_ID, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID).toBase58();
    }
    async _assignTokenAccountIds() {
        const accounts = await this.prismaService.account.findMany({
            where: {
                tokenAccountId: null,
            },
            select: {
                id: true,
                publicKey: true,
            },
        });
        if (accounts.length === 0)
            return;
        const config = await this.appService.getConfig();
        for (const account of accounts) {
            await this.accountsService.update(account.id, {
                tokenAccountId: this._getTokenAddress(config.tokenId, account.publicKey),
            });
        }
    }
    async syncByRpcRequest({ accountIds }) {
        await this._assignTokenAccountIds();
        const accounts = await this.prismaService.account.findMany({
            where: {
                OR: [
                    { id: { in: accountIds } },
                    { publicKey: { in: accountIds } },
                    { tokenAccountId: { in: accountIds } },
                ],
                isRemoved: false,
                isActive: true,
            },
            select: {
                publicKey: true,
                tokenAccountId: true,
                isBalanceSynced: true,
                isTokenBalanceSynced: true,
                isTokenAccountInitialized: true,
            },
        });
        // this.logger.log(`Syncing ${accounts.length} accounts by RPC request`);
        if (accounts.length === 0)
            return;
        const tokenAccountIdToAccount = new Map(accounts.map((account) => [account.tokenAccountId, account]));
        const accountIdsForInfo = accounts
            .map((a) => [
            a.publicKey,
            ...(a.tokenAccountId ? [a.tokenAccountId] : []),
        ])
            .flat();
        const accountsInfo = await this.solanaService.getAccountsInfo({
            accountIds: accountIdsForInfo,
            connection: this.providerService.connection,
        });
        await Promise.all(accountsInfo.map(({ accountId, info }) => new Promise(async (resolve) => {
            try {
                const isTokenAccount = tokenAccountIdToAccount.has(accountId);
                if (isTokenAccount) {
                    const account = tokenAccountIdToAccount.get(accountId);
                    await this._onTokenAccountChange({
                        ...(account ? { accountId: account.publicKey } : {}),
                        tokenAccountId: accountId,
                        info,
                    });
                }
                else {
                    await this._onAccountChange({
                        accountId,
                        info,
                    });
                }
            }
            catch (error) {
                this.logger.error(error);
            }
            resolve(null);
        })));
    }
    /**
     * Handler for tx created event
     * @param event
     */
    async onNewTxCreated(event) {
        const { txHash, signerIds } = event?.params || {};
        this.logger.debug(`Transaction created ${txHash}`);
        // Until transaction is completed, we need to mark account as not synced
        if (signerIds) {
            await this.prismaService.account.updateMany({
                where: {
                    publicKey: {
                        in: signerIds,
                    },
                },
                data: {
                    isBalanceSynced: false,
                    isTokenBalanceSynced: false,
                },
            });
        }
        await this.txService.create({
            txHash,
            signerIds,
        });
    }
    async _lazyAccountSync() {
        // Exclude synchronizing accounts that have processing transactions
        const ongoingTransactions = await this.txService.getOngoing();
        const txProcessingSignerIds = ongoingTransactions.reduce((acc, tx) => {
            acc.push(...tx.signerIds);
            return acc;
        }, []);
        // const dcaActiveAccounts =
        //   await this.prismaService.dcaSolanaAccount.findMany({
        //     where: {
        //       isActive: true,
        //     },
        //     select: {
        //       accountId: true,
        //     },
        //   });
        // if (dcaActiveAccounts.length === 0) return;
        // const dcaAccountIdsSet = new Set(
        //   dcaActiveAccounts.map((account) => account.accountId),
        // );
        // for (const signerId of txProcessingSignerIds) {
        //   if (dcaAccountIdsSet.has(signerId)) {
        //     dcaAccountIdsSet.delete(signerId);
        //   }
        // }
        // if (dcaAccountIdsSet.size === 0) return;
        const accounts = await this.prismaService.account.findMany({
            where: {
                publicKey: {
                    // in: Array.from(dcaAccountIdsSet),
                    notIn: txProcessingSignerIds,
                },
            },
        });
        if (accounts.length === 0)
            return;
        // this.logger.log(
        //   `Starting planned synchronization of ${accounts.length} accounts`,
        // );
        await this.syncByRpcRequest({
            accountIds: accounts.map((a) => a.publicKey),
        });
    }
    async _lazyTxsSync() {
        const ongoingTxs = await this.txService.getOngoing();
        if (ongoingTxs.length === 0)
            return;
        const txStatuses = await this.solanaService.getTxsStatuses({
            txHashes: ongoingTxs.map((tx) => tx.txHash),
            connection: this.providerService.connection,
        });
        await Promise.all(ongoingTxs.map(({ txHash, signerIds }) => new Promise(async (resolve) => {
            try {
                const status = txStatuses.find((s) => s.txHash === txHash)?.status;
                if (!status) {
                    throw Error;
                }
                await this._onTxSignature({
                    txHash,
                    status,
                    signerIds,
                });
            }
            catch (error) {
                this.logger.error(error);
            }
            resolve(null);
        })));
    }
    /**
     * When new account is created, we need to setup listener for it
     * So we can track the changes of it's balance and etc
     * @param event
     */
    async onNewAccountCreated() {
        await this.synchonizeAccounts({
            type: "unsynced",
        });
    }
};
exports.SolanaBlockhainSynchronizerJob = SolanaBlockhainSynchronizerJob;
__decorate([
    (0, event_emitter_1.OnEvent)(solana_events_1.SolanaSynchronizeAccountsEvent.id),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [solana_events_1.SolanaSynchronizeAccountsEvent]),
    __metadata("design:returntype", Promise)
], SolanaBlockhainSynchronizerJob.prototype, "synchonizeAccounts", null);
__decorate([
    (0, event_emitter_1.OnEvent)(solana_events_1.SolanaTxCreatedEvent.id),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [solana_events_1.SolanaTxCreatedEvent]),
    __metadata("design:returntype", Promise)
], SolanaBlockhainSynchronizerJob.prototype, "onNewTxCreated", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SolanaBlockhainSynchronizerJob.prototype, "_lazyAccountSync", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SolanaBlockhainSynchronizerJob.prototype, "_lazyTxsSync", null);
__decorate([
    (0, event_emitter_1.OnEvent)(accounts_events_1.AccountCreatedEvent.id),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SolanaBlockhainSynchronizerJob.prototype, "onNewAccountCreated", null);
exports.SolanaBlockhainSynchronizerJob = SolanaBlockhainSynchronizerJob = SolanaBlockhainSynchronizerJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [solana_dca_service_1.SolanaDcaService,
        app_service_1.AppService,
        solana_transactions_service_1.SolanaTransactionsService,
        prisma_service_1.PrismaService,
        solana_service_1.SolanaService,
        solana_provider_service_1.SolanaProviderService,
        accounts_service_1.AccountsService,
        solana_token_service_1.SolanaTokenService,
        event_emitter_1.EventEmitter2])
], SolanaBlockhainSynchronizerJob);
