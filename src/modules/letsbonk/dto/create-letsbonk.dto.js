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
exports.CreateLetsBonkDto = void 0;
var class_validator_1 = require("class-validator");
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
        __metadata("design:type", String)
    ], TokenMetadataDto.prototype, "symbol", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        __metadata("design:type", String)
    ], TokenMetadataDto.prototype, "uri", void 0);
    return TokenMetadataDto;
}());
var CreateLetsBonkDto = /** @class */ (function () {
    function CreateLetsBonkDto() {
    }
    __decorate([
        (0, class_validator_1.IsObject)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", TokenMetadataDto)
    ], CreateLetsBonkDto.prototype, "tokenMetadata", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], CreateLetsBonkDto.prototype, "ownerPublicKey", void 0);
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsString)({ each: true }),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", Array)
    ], CreateLetsBonkDto.prototype, "buyerWallets", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", Number)
    ], CreateLetsBonkDto.prototype, "initialBuyAmount", void 0);
    return CreateLetsBonkDto;
}());
exports.CreateLetsBonkDto = CreateLetsBonkDto;
