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
exports.DcaAccountEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class DcaAccountEntity {
}
exports.DcaAccountEntity = DcaAccountEntity;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The id of the solana DCA account (also public key)",
    }),
    __metadata("design:type", String)
], DcaAccountEntity.prototype, "accountId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The amount of SOL that will be used for each transaction",
        example: 0.01,
    }),
    __metadata("design:type", Number)
], DcaAccountEntity.prototype, "bumpOperateSolAmount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "How much tokens we will sell every time",
        example: 50,
    }),
    __metadata("design:type", Number)
], DcaAccountEntity.prototype, "balanceUsagePercent", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The minimum price of the token to sell",
        example: 0.0000000278,
    }),
    __metadata("design:type", Number)
], DcaAccountEntity.prototype, "minTokenPrice", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The maximum price of the token to sell",
        example: 0.000008,
    }),
    __metadata("design:type", Number)
], DcaAccountEntity.prototype, "maxTokenPrice", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The minimum delay between transactions for account in seconds",
        example: 15,
    }),
    __metadata("design:type", Number)
], DcaAccountEntity.prototype, "minDelayBetweenTxsInSeconds", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The maximum delay between transactions for account in seconds",
        example: 60,
    }),
    __metadata("design:type", Number)
], DcaAccountEntity.prototype, "maxDelayBetweenTxsInSeconds", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, swagger_1.ApiProperty)({
        description: "How much we ready to lost",
        example: 5,
    }),
    __metadata("design:type", Number)
], DcaAccountEntity.prototype, "slippagePercent", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "How much solana we will store in any circumstance",
        example: 0.1,
    }),
    __metadata("design:type", Number)
], DcaAccountEntity.prototype, "reserveSolAmount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "When we will sell the token, we need to have at least this amount",
        example: 1000,
    }),
    __metadata("design:type", Number)
], DcaAccountEntity.prototype, "minTokenAmountPerSale", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "How much tokens we can buy",
        example: 20000000,
    }),
    __metadata("design:type", Number)
], DcaAccountEntity.prototype, "maxTokenAmount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "How much tokens we will store in any circumstance",
        example: 2000000,
    }),
    __metadata("design:type", Number)
], DcaAccountEntity.prototype, "reserveTokenAmount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        description: "Is buying allowed for auto orders?",
        example: true,
    }),
    __metadata("design:type", Boolean)
], DcaAccountEntity.prototype, "canBuy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        description: "Is selling allowed for auto orders?",
        example: true,
    }),
    __metadata("design:type", Boolean)
], DcaAccountEntity.prototype, "canSell", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        description: "When active transactions will be working",
        example: true,
    }),
    __metadata("design:type", Boolean)
], DcaAccountEntity.prototype, "isActive", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: "The date when the account was created",
    }),
    __metadata("design:type", Date)
], DcaAccountEntity.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: "The date when the account was last updated",
    }),
    __metadata("design:type", Date)
], DcaAccountEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "Last tx type",
    }),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], DcaAccountEntity.prototype, "lastTxType", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: "Allow next at date",
    }),
    __metadata("design:type", Date)
], DcaAccountEntity.prototype, "allowNextAt", void 0);
