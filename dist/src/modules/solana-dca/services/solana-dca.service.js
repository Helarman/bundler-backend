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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDcaService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const accounts_events_1 = require("../../accounts/events/accounts.events");
const prisma_service_1 = require("../../../prisma.service");
let SolanaDcaService = class SolanaDcaService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async onModuleInit() {
        await this._createUncreatedAccounts();
    }
    /**
     * Called when new account is created
     * @param account
     */
    async _onNewAccountCreated() {
        await this._createUncreatedAccounts();
    }
    /**
     * Created DCA accounts that are not created yet
     * @returns
     */
    async _createUncreatedAccounts() {
        const accounts = await this.prismaService.account.findMany();
        const dcaAccounts = await this.prismaService.dcaSolanaAccount.findMany();
        const dcaAccountsIdsSet = new Set(dcaAccounts.map((account) => account.accountId));
        const accountIdsToCreate = accounts.reduce((acc, curr) => {
            const { publicKey } = curr;
            if (!dcaAccountsIdsSet.has(publicKey)) {
                acc.push(publicKey);
            }
            return acc;
        }, []);
        if (accountIdsToCreate.length === 0)
            return;
        await this.prismaService.dcaSolanaAccount.createMany({
            data: accountIdsToCreate.map((accountId) => ({
                accountId,
                maxTokenPrice: 0,
                minTokenPrice: 0,
                isActive: false,
            })),
        });
    }
    async getAccounts() {
        return await this.prismaService.dcaSolanaAccount.findMany({
            orderBy: {
                accountId: "asc",
            },
        });
    }
    async getLoopAccounts() {
        return await this.prismaService.dcaSolanaAccount.findMany({
            where: {
                isActive: true,
                account: {
                    OR: [
                        {
                            isBalanceSynced: true,
                            isTokenBalanceSynced: true,
                            isActive: true,
                        },
                        {
                            isBalanceSynced: true,
                            isTokenBalanceSynced: false,
                            isTokenAccountInitialized: false,
                            isActive: true,
                        },
                    ],
                },
            },
            include: {
                account: true,
            },
        });
    }
    async saveBuyDate(accountId) {
        const account = await this.prismaService.account.findFirst({
            where: {
                OR: [{ id: accountId }, { publicKey: accountId }],
            },
        });
        if (!account)
            return;
        return await this.prismaService.account.update({
            where: {
                id: account.id,
            },
            data: {
                lastBuyAt: new Date(),
            },
        });
    }
    async saveSellDate(accountId) {
        const account = await this.prismaService.account.findFirst({
            where: {
                OR: [{ id: accountId }, { publicKey: accountId }],
            },
        });
        if (!account)
            return;
        return await this.prismaService.account.update({
            where: {
                id: account.id,
            },
            data: {
                lastSellAt: new Date(),
            },
        });
    }
    async updateAccount(id, dto) {
        return await this.prismaService.dcaSolanaAccount.update({
            where: {
                accountId: id,
            },
            data: {
                ...dto,
            },
        });
    }
    async updateAllAccounts(dto) {
        await this.prismaService.dcaSolanaAccount.updateMany({
            data: {
                ...dto,
            },
        });
        return await this.getAccounts();
    }
};
exports.SolanaDcaService = SolanaDcaService;
__decorate([
    (0, event_emitter_1.OnEvent)(accounts_events_1.AccountCreatedEvent.id),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SolanaDcaService.prototype, "_onNewAccountCreated", null);
exports.SolanaDcaService = SolanaDcaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SolanaDcaService);
