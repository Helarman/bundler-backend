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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const base58 = __importStar(require("bs58"));
const common_1 = require("@nestjs/common");
const web3_js_1 = require("@solana/web3.js");
const prisma_service_1 = require("../../../prisma.service");
const faker_1 = require("@faker-js/faker");
const encryption_service_1 = require("../../encryption/encryption.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const accounts_events_1 = require("../events/accounts.events");
const bs58 = __importStar(require("bs58"));
const solana_service_1 = require("../../solana/services/solana.service");
let AccountsService = class AccountsService {
    constructor(db, solanaService, encryptionService, eventEmitter) {
        this.db = db;
        this.solanaService = solanaService;
        this.encryptionService = encryptionService;
        this.eventEmitter = eventEmitter;
    }
    async isTokenAccountInitialized(tokenAccountId) {
        const tokenAccount = await this.db.account.findFirst({
            where: {
                tokenAccountId,
            },
        });
        if (!tokenAccount)
            return false;
        return tokenAccount.isTokenAccountInitialized;
    }
    async import(dto, userId) {
        const account = web3_js_1.Keypair.fromSecretKey(typeof dto.secretKey === "string"
            ? bs58.decode(dto.secretKey)
            : new Uint8Array(dto.secretKey));
        const accountInfo = await this.solanaService.connection.getAccountInfo(account.publicKey);
        if (!accountInfo) {
            throw new common_1.BadRequestException("Account not found");
        }
        if (!userId)
            throw new common_1.BadRequestException("User ID is required");
        const data = await this.db.account.create({
            data: {
                ...dto,
                publicKey: account.publicKey.toBase58(),
                secretKey: this.encryptionService.encrypt(base58.encode(account.secretKey)),
                name: "IMPORT-" + faker_1.faker.internet.userName(),
                color: "#ff0000",
                isImported: true,
                userId,
                isActive: true,
            },
        });
        this.eventEmitter.emit(accounts_events_1.AccountCreatedEvent.id, new accounts_events_1.AccountCreatedEvent(data));
        return data;
    }
    async createRandomOne(dto, userId) {
        if (!userId)
            throw new common_1.BadRequestException("User ID is required");
        try {
            const keypair = web3_js_1.Keypair.generate();
            const publicKey = keypair.publicKey.toBase58();
            const existingAccount = await this.db.account.findUnique({
                where: { publicKey },
            });
            if (existingAccount) {
                throw new common_1.BadRequestException("Account with this publicKey already exists");
            }
            const secretKey = this.encryptionService.encrypt(bs58.encode(keypair.secretKey));
            ;
            const account = await this.db.account.create({
                data: {
                    name: faker_1.faker.internet.userName(),
                    color: faker_1.faker.color.rgb(),
                    publicKey,
                    secretKey,
                    isActive: true,
                    userId,
                    ...(dto || {}),
                },
            });
            this.eventEmitter.emit(accounts_events_1.AccountCreatedEvent.id, new accounts_events_1.AccountCreatedEvent(account));
            return account;
        }
        catch (error) {
            console.error("Account creation failed:", error instanceof Error ? error.message : String(error));
            throw new common_1.InternalServerErrorException("Failed to create account");
        }
    }
    async findAll(options) {
        const { withSecretKeys } = options || {};
        let accounts = await this.db.account.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        if (withSecretKeys) {
            accounts = accounts.map((account) => ({
                ...account,
                secretKey: this.encryptionService.decrypt(account.secretKey),
            }));
        }
        return accounts;
    }
    async findOne(id) {
        return await this.db.account.findFirst({
            where: {
                OR: [
                    {
                        id,
                    },
                    {
                        publicKey: id,
                    },
                ],
            },
        });
    }
    async getSecretKey(id) {
        const account = await this.findOne(id);
        return this.encryptionService.decrypt(account.secretKey);
    }
    async update(id, dto) {
        const account = await this.findOne(id);
        if (!account)
            return null;
        return await this.db.account.update({
            where: {
                id: account.id,
            },
            data: {
                ...dto,
            },
        });
    }
    async updateByTokenAccount(tokenAccountId, dto) {
        const account = await this.db.account.findFirst({
            where: {
                tokenAccountId,
            },
        });
        if (!account)
            return null;
        return await this.db.account.update({
            where: {
                id: account.id,
            },
            data: {
                ...dto,
            },
        });
    }
    async remove(id) {
        return await this.db.account.update({
            where: {
                id,
            },
            data: {
                isRemoved: true,
                removedAt: new Date(),
            },
        });
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        solana_service_1.SolanaService,
        encryption_service_1.EncryptionService,
        event_emitter_1.EventEmitter2])
], AccountsService);
