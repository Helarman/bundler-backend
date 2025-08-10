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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const user_dto_1 = require("./dto/user.dto");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserById(id) {
        if (!id) {
            throw new Error('User ID is required');
        }
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                rpcUrl: true,
                wssRpcUrl: true,
                devWallet: true,
                apiKey: true,
                transactionFee: true,
                isConfirmed: true,
                isSettingConfirmed: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return new user_dto_1.UserResponseDto(user);
    }
    async updateUser(id, dto) {
        if (!id) {
            throw new Error('User ID is required');
        }
        try {
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: {
                    rpcUrl: dto.rpcUrl,
                    wssRpcUrl: dto.wssRpcUrl,
                    devWallet: dto.devWallet,
                },
                select: {
                    id: true,
                    email: true,
                    rpcUrl: true,
                    wssRpcUrl: true,
                    devWallet: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return new user_dto_1.UserResponseDto(updatedUser);
        }
        catch (error) {
            throw error;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
