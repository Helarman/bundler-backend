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
exports.BuyAllSPLDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class BuyAllSPLDto {
}
exports.BuyAllSPLDto = BuyAllSPLDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The amount of solana that will be left on the accounts",
        example: 0.01,
    }),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], BuyAllSPLDto.prototype, "keepSolanaAmount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, swagger_1.ApiProperty)({
        description: "The percentage of the solana balance that will be bought",
        example: 100,
    }),
    __metadata("design:type", Number)
], BuyAllSPLDto.prototype, "percent", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, swagger_1.ApiProperty)({
        description: "The slippage percentage",
        example: 1,
    }),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], BuyAllSPLDto.prototype, "slippagePercent", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The priority lamports fee",
        example: 0,
    }),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], BuyAllSPLDto.prototype, "priorityMicroLamptorsFee", void 0);
