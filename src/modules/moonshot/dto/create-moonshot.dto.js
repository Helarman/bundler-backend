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
exports.CreateMoonshotDto = void 0;
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
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], TokenMetadataDto.prototype, "symbol", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], TokenMetadataDto.prototype, "description", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], TokenMetadataDto.prototype, "imageUrl", void 0);
    return TokenMetadataDto;
}());
var MoonshotConfigDto = /** @class */ (function () {
    function MoonshotConfigDto() {
    }
    __decorate([
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return TokenMetadataDto; }),
        __metadata("design:type", TokenMetadataDto)
    ], MoonshotConfigDto.prototype, "tokenMetadata", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        __metadata("design:type", Array)
    ], MoonshotConfigDto.prototype, "additionalParams", void 0);
    return MoonshotConfigDto;
}());
var CreateMoonshotDto = /** @class */ (function () {
    function CreateMoonshotDto() {
    }
    __decorate([
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return MoonshotConfigDto; }),
        __metadata("design:type", MoonshotConfigDto)
    ], CreateMoonshotDto.prototype, "config", void 0);
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", Array)
    ], CreateMoonshotDto.prototype, "buyerWallets", void 0);
    return CreateMoonshotDto;
}());
exports.CreateMoonshotDto = CreateMoonshotDto;
