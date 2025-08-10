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
exports.AccountsController = void 0;
const controller_decorator_1 = require("../../@core/decorators/controller.decorator");
const serializable_decorator_1 = require("../../@core/decorators/serializable.decorator");
const user_decorator_1 = require("../../@core/decorators/user.decorator");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const swagger_1 = require("@nestjs/swagger");
const create_account_dto_1 = require("../dtos/create-account.dto");
const transfer_sol_dto_1 = require("../dtos/transfer-sol.dto");
const update_account_dto_1 = require("../dtos/update-account.dto");
const account_entity_1 = require("../entities/account.entity");
const transaction_entity_1 = require("../entities/transaction.entity");
const accounts_service_1 = require("../services/accounts.service");
const solana_events_1 = require("../../solana/events/solana.events");
const solana_service_1 = require("../../solana/services/solana.service");
const user_service_1 = require("../../user/user.service");
const bs58 = __importStar(require("bs58"));
const web3_js_1 = require("@solana/web3.js");
const export_account_dto_1 = require("../dtos/export-account.dto");
const import_account_dto_1 = require("../dtos/import-account.dto");
const user_entity_1 = require("../../user/entities/user.entity");
const auth_service_1 = require("../../auth/auth.service");
let AccountsController = class AccountsController {
    constructor(service, usersService, solanaService, eventEmitter, authService) {
        this.service = service;
        this.usersService = usersService;
        this.solanaService = solanaService;
        this.eventEmitter = eventEmitter;
        this.authService = authService;
    }
    async sync() {
        this.eventEmitter.emit(solana_events_1.SolanaSynchronizeAccountsEvent.id);
        return "OK";
    }
    async syncAll() {
        this.eventEmitter.emit(solana_events_1.SolanaSynchronizeAccountsEvent.id, {
            type: "all",
        });
        return "OK";
    }
    async findAll() {
        return await this.service.findAll();
    }
    async import(payload, user) {
        return await this.service.import(payload, user.id);
    }
    async findOne(id) {
        const account = await this.service.findOne(id);
        if (!account) {
            throw new common_1.NotFoundException(`Account with id ${id} not found`);
        }
        return account;
    }
    async getSecretKey(id, payload, user) {
        const { password } = payload;
        if (!(await this.authService.validateUser(user.email, password))) {
            throw new common_1.ForbiddenException("Invalid password");
        }
        const secretKey = await this.service.getSecretKey(id);
        await this.service.update(id, {
            exportedAt: new Date(),
        });
        return secretKey;
    }
    create(payload, user) {
        return this.service.createRandomOne(payload, user.id);
    }
    async transferSol(id, payload) {
        const { percent, recipient, priorityMicroLamptorsFee, ignoreRecipientNotFound, } = payload;
        const account = await this.service.findOne(id);
        if (!account) {
            throw new common_1.NotFoundException(`Account with id ${id} not found`);
        }
        if (!percent && !payload?.amount) {
            throw new common_1.BadRequestException("Percent or amount is required");
        }
        let amount = payload?.amount || 0;
        if (percent) {
            amount = account.balance * (percent / 100);
        }
        const secretKey = await this.service.getSecretKey(id);
        const txHash = await this.solanaService.transferSolana(web3_js_1.Keypair.fromSecretKey(bs58.decode(secretKey)), new web3_js_1.PublicKey(recipient), amount, priorityMicroLamptorsFee, ignoreRecipientNotFound);
        this.eventEmitter.emit(solana_events_1.SolanaTxCreatedEvent.id, new solana_events_1.SolanaTxCreatedEvent({
            txHash,
            signerIds: [account.publicKey],
        }));
        return {
            txHash,
        };
    }
    update(id, payload) {
        return this.service.update(id, payload);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.AccountsController = AccountsController;
__decorate([
    (0, common_1.Post)("sync"),
    (0, swagger_1.ApiOperation)({
        summary: "Synchronize accounts with blockchain",
        description: "This method synchronize accounts with blockchain by getting accounts balance from RPC",
    }),
    (0, swagger_1.ApiOkResponse)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "sync", null);
__decorate([
    (0, common_1.Post)("sync/all"),
    (0, swagger_1.ApiOperation)({
        summary: "Synchronize all accounts with blockchain",
        description: "This method synchronize all accounts with blockchain by getting accounts balance from RPC",
    }),
    (0, swagger_1.ApiOkResponse)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "syncAll", null);
__decorate([
    (0, common_1.Get)(),
    (0, serializable_decorator_1.Serializable)(account_entity_1.AccountEntity),
    (0, swagger_1.ApiOperation)({ summary: "Get all accounts" }),
    (0, swagger_1.ApiOkResponse)({
        description: "Array of accounts",
        type: account_entity_1.AccountEntity,
        isArray: true,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)("import"),
    (0, serializable_decorator_1.Serializable)(account_entity_1.AccountEntity),
    (0, swagger_1.ApiOperation)({
        summary: "Import account",
        description: "WE CAN'T GUARANTEE THAT THE ACCOUNT WILL NOT LOST SINCE IT IS IMPORTED",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Account",
        type: account_entity_1.AccountEntity,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.UserFromJwt)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_account_dto_1.ImportAccountDto,
        user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "import", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, serializable_decorator_1.Serializable)(account_entity_1.AccountEntity),
    (0, swagger_1.ApiOperation)({ summary: "Get account by it's id" }),
    (0, swagger_1.ApiOkResponse)({
        description: "Account",
        type: account_entity_1.AccountEntity,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "Account not found",
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(":id/export"),
    (0, swagger_1.ApiOperation)({
        summary: "Export secret key of the account",
        description: "AFTER EXPORTING THE SECRET KEY WE CAN'T GUARANTEE THAT THE ACCOUNT WILL NOT LOST",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Secret key of the solana account",
        type: String,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: "Invalid password",
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.UserFromJwt)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, export_account_dto_1.ExportAccountDto,
        user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "getSecretKey", null);
__decorate([
    (0, common_1.Post)(),
    (0, serializable_decorator_1.Serializable)(account_entity_1.AccountEntity),
    (0, swagger_1.ApiOperation)({ summary: "Create new account" }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "Account",
        type: account_entity_1.AccountEntity,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.UserFromJwt)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_account_dto_1.CreateAccountDto, user_entity_1.UserEntity]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id/sol-transfer"),
    (0, serializable_decorator_1.Serializable)(transaction_entity_1.SolanaTransactionEntity),
    (0, swagger_1.ApiOperation)({
        summary: "Transfer SOL to account",
        description: "This method transfer SOL to account. EVERYONE WILL BE KNOW WHO IS THE RECIPIENT",
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "Transaction",
        type: transaction_entity_1.SolanaTransactionEntity,
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, transfer_sol_dto_1.TransferSolDto]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "transferSol", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, serializable_decorator_1.Serializable)(account_entity_1.AccountEntity),
    (0, swagger_1.ApiOperation)({ summary: "Update account" }),
    (0, swagger_1.ApiOkResponse)({
        description: "Updated account",
        type: account_entity_1.AccountEntity,
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_account_dto_1.UpdateAccountDto]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: "Remove account" }),
    (0, swagger_1.ApiNoContentResponse)({
        description: "Account removed",
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "remove", null);
exports.AccountsController = AccountsController = __decorate([
    (0, controller_decorator_1.Controller)("accounts"),
    __metadata("design:paramtypes", [accounts_service_1.AccountsService,
        user_service_1.UserService,
        solana_service_1.SolanaService,
        event_emitter_1.EventEmitter2,
        auth_service_1.AuthService])
], AccountsController);
