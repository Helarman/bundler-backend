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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDcaController = void 0;
const controller_decorator_1 = require("../@core/decorators/controller.decorator");
const serializable_decorator_1 = require("../@core/decorators/serializable.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_dca_account_dto_1 = require("./dtos/update-dca-account.dto");
const dca_order_account_entity_1 = require("./entities/dca-order-account.entity");
const solana_dca_service_1 = require("./services/solana-dca.service");
let SolanaDcaController = class SolanaDcaController {
    constructor(service) {
        this.service = service;
    }
    async getAccounts() {
        return await this.service.getAccounts();
    }
    async updateAllAccounts(payload) {
        return await this.service.updateAllAccounts(payload);
    }
    async updateAccount(id, payload) {
        return await this.service.updateAccount(id, payload);
    }
    async turnOnAllAccounts() {
        return await this.service.updateAllAccounts({
            isActive: true,
        });
    }
    async turnOffAllAccounts() {
        return await this.service.updateAllAccounts({
            isActive: false,
        });
    }
};
exports.SolanaDcaController = SolanaDcaController;
__decorate([
    (0, common_1.Get)("accounts"),
    (0, serializable_decorator_1.Serializable)(dca_order_account_entity_1.DcaAccountEntity),
    (0, swagger_1.ApiOperation)({
        summary: "Get all solana DCA accounts",
        description: "This method returns all solana DCA accounts than created and assigned to the accounts. You can explitly edit some of them",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Array of solana DCA accounts",
        type: [dca_order_account_entity_1.DcaAccountEntity],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SolanaDcaController.prototype, "getAccounts", null);
__decorate([
    (0, common_1.Patch)("accounts/all"),
    (0, serializable_decorator_1.Serializable)(dca_order_account_entity_1.DcaAccountEntity),
    (0, swagger_1.ApiOperation)({
        summary: "Update all solana DCA accounts",
        description: "Updates all existing solana DCA accounts with provided data",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Updated solana DCA accounts",
        type: [dca_order_account_entity_1.DcaAccountEntity],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_dca_account_dto_1.UpdateDcaAccountDto]),
    __metadata("design:returntype", Promise)
], SolanaDcaController.prototype, "updateAllAccounts", null);
__decorate([
    (0, common_1.Patch)("accounts/:id"),
    (0, serializable_decorator_1.Serializable)(dca_order_account_entity_1.DcaAccountEntity),
    (0, swagger_1.ApiOperation)({
        summary: "Update solana DCA account",
        description: "This method updates solana DCA account",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Updated solana DCA account",
        type: dca_order_account_entity_1.DcaAccountEntity,
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_dca_account_dto_1.UpdateDcaAccountDto]),
    __metadata("design:returntype", Promise)
], SolanaDcaController.prototype, "updateAccount", null);
__decorate([
    (0, common_1.Post)("on"),
    (0, swagger_1.ApiOperation)({
        summary: "Activate all solana DCA accounts",
        description: "This method activates all solana DCA accounts",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Activated solana DCA accounts",
        type: [dca_order_account_entity_1.DcaAccountEntity],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SolanaDcaController.prototype, "turnOnAllAccounts", null);
__decorate([
    (0, common_1.Delete)("off"),
    (0, swagger_1.ApiOperation)({
        summary: "Deactivate all solana DCA accounts",
        description: "This method deactivates all solana DCA accounts",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Deactivated solana DCA accounts",
        type: [dca_order_account_entity_1.DcaAccountEntity],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SolanaDcaController.prototype, "turnOffAllAccounts", null);
exports.SolanaDcaController = SolanaDcaController = __decorate([
    (0, controller_decorator_1.Controller)("solana-dca"),
    __metadata("design:paramtypes", [solana_dca_service_1.SolanaDcaService])
], SolanaDcaController);
