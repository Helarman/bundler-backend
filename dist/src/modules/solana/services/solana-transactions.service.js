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
exports.SolanaTransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
let SolanaTransactionsService = class SolanaTransactionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async get(txHash) {
        return await this.prisma.solanaTx.findUnique({
            where: {
                txHash,
            },
        });
    }
    async getLastForSigner(signerId) {
        return await this.prisma.solanaTx.findFirst({
            where: {
                signerIds: {
                    has: signerId,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getOngoing() {
        return await this.prisma.solanaTx.findMany({
            where: {
                isConfirmed: false,
                isFailed: false,
            },
        });
    }
    async getOngoingSignerIds() {
        const txs = await this.getOngoing();
        return [...new Set(txs.map((tx) => tx.signerIds).flat())];
    }
    async create(data) {
        return await this.prisma.solanaTx.create({
            data,
        });
    }
    async update(txHash, data) {
        return await this.prisma.solanaTx.update({
            where: {
                txHash,
            },
            data,
        });
    }
    async failTx(txHash) {
        return await this.prisma.solanaTx.update({
            where: {
                txHash,
            },
            data: {
                isFailed: true,
                failedAt: new Date(),
            },
        });
    }
    async confirmTx(txHash) {
        return await this.prisma.solanaTx.update({
            where: {
                txHash,
            },
            data: {
                isConfirmed: true,
                confirmedAt: new Date(),
            },
        });
    }
};
exports.SolanaTransactionsService = SolanaTransactionsService;
exports.SolanaTransactionsService = SolanaTransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SolanaTransactionsService);
