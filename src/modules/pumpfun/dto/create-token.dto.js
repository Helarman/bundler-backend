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
exports.CreateTokenDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var TokenMetadataDto = /** @class */ (function () {
    function TokenMetadataDto() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], TokenMetadataDto.prototype, "name", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], TokenMetadataDto.prototype, "symbol", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], TokenMetadataDto.prototype, "file", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], TokenMetadataDto.prototype, "imageUrl", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], TokenMetadataDto.prototype, "description", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], TokenMetadataDto.prototype, "twitter", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], TokenMetadataDto.prototype, "telegram", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], TokenMetadataDto.prototype, "website", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Number)
    ], TokenMetadataDto.prototype, "decimals", void 0);
    return TokenMetadataDto;
}());
var TokenCreationConfigDto = /** @class */ (function () {
    function TokenCreationConfigDto() {
    }
    __decorate([
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return TokenMetadataDto; }),
        __metadata("design:type", TokenMetadataDto)
    ], TokenCreationConfigDto.prototype, "metadata", void 0);
    return TokenCreationConfigDto;
}());
var CreateTokenDto = /** @class */ (function () {
    function CreateTokenDto() {
    }
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", Array)
    ], CreateTokenDto.prototype, "walletAddresses", void 0);
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", Array)
    ], CreateTokenDto.prototype, "amounts", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], CreateTokenDto.prototype, "mintPubkey", void 0);
    __decorate([
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return TokenCreationConfigDto; }),
        __metadata("design:type", Object)
    ], CreateTokenDto.prototype, "config", void 0);
    return CreateTokenDto;
}());
exports.CreateTokenDto = CreateTokenDto;
