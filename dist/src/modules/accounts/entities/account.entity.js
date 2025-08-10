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
exports.AccountEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class AccountEntity {
}
exports.AccountEntity = AccountEntity;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        description: "The unique identifier of the account",
        example: "c24ef4b2-bd4a-4d5a-ae4c-d1b3ee1e4f4e",
    }),
    __metadata("design:type", String)
], AccountEntity.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsEnum)(client_1.AccountType),
    (0, swagger_1.ApiProperty)({
        description: "The type of the account",
        example: client_1.AccountType.SOLANA,
    }),
    __metadata("design:type", String)
], AccountEntity.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        description: "The unique identifier of the user that created the account",
        example: "c24ef4b2-bd4a-4d5a-ae4c-d1b3ee1e4f4e",
    }),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AccountEntity.prototype, "userId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsHexColor)(),
    (0, swagger_1.ApiProperty)({
        description: "The color of the account",
        example: "#ff0000",
    }),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AccountEntity.prototype, "color", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 100),
    (0, swagger_1.ApiProperty)({
        description: "The name of the account",
        example: "JohnDoe",
    }),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AccountEntity.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The public key of the solana account",
        example: "5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAnchuDf",
    }),
    __metadata("design:type", String)
], AccountEntity.prototype, "publicKey", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The public key of the solana token account",
        example: "5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAnchuDf",
    }),
    __metadata("design:type", Object)
], AccountEntity.prototype, "tokenAccountId", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AccountEntity.prototype, "secretKey", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsDecimal)({
        decimal_digits: "12",
    }),
    (0, swagger_1.ApiProperty)({
        description: "The balance of the account",
        example: 5.123456789,
    }),
    __metadata("design:type", Number)
], AccountEntity.prototype, "balance", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsDecimal)({
        decimal_digits: "12",
    }),
    (0, swagger_1.ApiProperty)({
        description: "The token balance of the account",
        example: 124532,
    }),
    __metadata("design:type", Number)
], AccountEntity.prototype, "tokenBalance", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        description: "Whether the account balance is synced or not",
    }),
    __metadata("design:type", Boolean)
], AccountEntity.prototype, "isBalanceSynced", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        description: "Whether the account token balance is synced or not",
    }),
    __metadata("design:type", Boolean)
], AccountEntity.prototype, "isTokenBalanceSynced", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        description: "Whether the account token account is initialized or not",
    }),
    __metadata("design:type", Boolean)
], AccountEntity.prototype, "isTokenAccountInitialized", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        description: "Whether the account is active or not",
    }),
    __metadata("design:type", Boolean)
], AccountEntity.prototype, "isActive", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        description: "Whether the account is imported or not",
    }),
    __metadata("design:type", Boolean)
], AccountEntity.prototype, "isImported", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        description: "Whether the account is removed or not",
    }),
    __metadata("design:type", Boolean)
], AccountEntity.prototype, "isRemoved", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: "The date when the account was created",
    }),
    __metadata("design:type", Date)
], AccountEntity.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: "The date when the account was last updated",
    }),
    __metadata("design:type", Date)
], AccountEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: "The date when the account was synced",
    }),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], AccountEntity.prototype, "syncedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: "System timestamp that indicates is there any problem with the account and syncing",
    }),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], AccountEntity.prototype, "syncProblemInspectedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: "The date when the account was last bought",
    }),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], AccountEntity.prototype, "lastBuyAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: "The date when the account was last sold",
    }),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], AccountEntity.prototype, "lastSellAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: "The date when the account was removed",
    }),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], AccountEntity.prototype, "removedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: "The date when the account was exported",
    }),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], AccountEntity.prototype, "exportedAt", void 0);
