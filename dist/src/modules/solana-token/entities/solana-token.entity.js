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
exports.SolanaTokenDataEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class SolanaTokenDataEntity {
}
exports.SolanaTokenDataEntity = SolanaTokenDataEntity;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The public key of the token",
        example: "So11111111111111111111111111111111111111112",
    }),
    __metadata("design:type", String)
], SolanaTokenDataEntity.prototype, "mint", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The name of the token",
        example: "Solana",
    }),
    __metadata("design:type", String)
], SolanaTokenDataEntity.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The symbol of the token",
        example: "SOL",
    }),
    __metadata("design:type", String)
], SolanaTokenDataEntity.prototype, "symbol", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The description of the token",
        example: "Solana is a blockchain that allows you to build and run applications on its network.",
    }),
    __metadata("design:type", String)
], SolanaTokenDataEntity.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The image of the token",
        example: "https://solana.com/wp-content/uploads/2022/01/solana-logo.png",
    }),
    __metadata("design:type", String)
], SolanaTokenDataEntity.prototype, "image_uri", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The metadata of the token",
        example: "https://solana.com/wp-content/uploads/2022/01/solana-logo.png",
    }),
    __metadata("design:type", String)
], SolanaTokenDataEntity.prototype, "metadata_uri", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The Twitter handle of the token",
        example: "@solana",
        nullable: true,
    }),
    __metadata("design:type", Object)
], SolanaTokenDataEntity.prototype, "twitter", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The Telegram group of the token",
        example: "https://t.me/solana",
        nullable: true,
    }),
    __metadata("design:type", Object)
], SolanaTokenDataEntity.prototype, "telegram", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The bonding curve address of the token",
        example: "6QzTnHVtirQoFESMfruoErj63VdQ1Mwug8ku7cozE7zh",
    }),
    __metadata("design:type", String)
], SolanaTokenDataEntity.prototype, "bonding_curve", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The associated bonding curve address of the token",
        example: "9W5RLtqDUPUFRHBBqAtULufGLEmjUZeS1wLKUFXhNSfg",
    }),
    __metadata("design:type", String)
], SolanaTokenDataEntity.prototype, "associated_bonding_curve", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The creator's address",
        example: "CJCPJNLB9R3nWcetzZ3XqUNNpgG8FT1ud37zMYNcKZn4",
    }),
    __metadata("design:type", String)
], SolanaTokenDataEntity.prototype, "creator", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The creation timestamp",
        example: 1718270774645,
    }),
    __metadata("design:type", Number)
], SolanaTokenDataEntity.prototype, "created_timestamp", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The Raydium pool address",
        example: "RaydiumPoolAddress",
        nullable: true,
    }),
    __metadata("design:type", Object)
], SolanaTokenDataEntity.prototype, "raydium_pool", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        description: "Indicates if the token data is complete",
        example: false,
    }),
    __metadata("design:type", Boolean)
], SolanaTokenDataEntity.prototype, "complete", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The virtual Solana reserves",
        example: 30100362525,
    }),
    __metadata("design:type", Number)
], SolanaTokenDataEntity.prototype, "virtual_sol_reserves", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The virtual token reserves",
        example: 1069422363776860,
    }),
    __metadata("design:type", Number)
], SolanaTokenDataEntity.prototype, "virtual_token_reserves", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The total supply of the token",
        example: 1000000000000000,
    }),
    __metadata("design:type", Number)
], SolanaTokenDataEntity.prototype, "total_supply", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The website of the token",
        example: "https://solana.com",
        nullable: true,
    }),
    __metadata("design:type", Object)
], SolanaTokenDataEntity.prototype, "website", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        description: "Indicates if the token name should be shown",
        example: true,
    }),
    __metadata("design:type", Boolean)
], SolanaTokenDataEntity.prototype, "show_name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The King of the Hill timestamp",
        example: 1718270774645,
        nullable: true,
    }),
    __metadata("design:type", Object)
], SolanaTokenDataEntity.prototype, "king_of_the_hill_timestamp", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The market cap of the token",
        example: 28.146374664,
    }),
    __metadata("design:type", Number)
], SolanaTokenDataEntity.prototype, "market_cap", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The reply count of the token",
        example: 2,
    }),
    __metadata("design:type", Number)
], SolanaTokenDataEntity.prototype, "reply_count", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The last reply timestamp",
        example: 1719166751503,
    }),
    __metadata("design:type", Number)
], SolanaTokenDataEntity.prototype, "last_reply", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        description: "Indicates if the token is NSFW",
        example: false,
    }),
    __metadata("design:type", Boolean)
], SolanaTokenDataEntity.prototype, "nsfw", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The market ID",
        example: "MarketID",
        nullable: true,
    }),
    __metadata("design:type", Object)
], SolanaTokenDataEntity.prototype, "market_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        description: "Indicates if the token is inverted",
        example: false,
        nullable: true,
    }),
    __metadata("design:type", Object)
], SolanaTokenDataEntity.prototype, "inverted", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The username of the creator",
        example: "ASATIANI",
    }),
    __metadata("design:type", String)
], SolanaTokenDataEntity.prototype, "username", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "The profile image URI",
        example: "https://cf-ipfs.com/ipfs/QmZjkUUwxnMJqJ5q2Zre7iNUgS9Puew3Z6tazsLqcErKBL",
    }),
    __metadata("design:type", String)
], SolanaTokenDataEntity.prototype, "profile_image", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The USD market cap of the token",
        example: 3563.61249620904,
    }),
    __metadata("design:type", Number)
], SolanaTokenDataEntity.prototype, "usd_market_cap", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The solana price per token",
        example: 0.001,
    }),
    __metadata("design:type", Number)
], SolanaTokenDataEntity.prototype, "solana_price_per_token", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "The USD price per token",
        example: 0.001,
    }),
    __metadata("design:type", Number)
], SolanaTokenDataEntity.prototype, "usd_price_per_token", void 0);
