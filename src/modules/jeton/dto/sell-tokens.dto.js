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
exports.SellTokensDto = exports.TokenSellConfigDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var TokenSellConfigDto = /** @class */ (function () {
    function TokenSellConfigDto() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], TokenSellConfigDto.prototype, "tokenAddress", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], TokenSellConfigDto.prototype, "protocol", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        __metadata("design:type", Number)
    ], TokenSellConfigDto.prototype, "percentage", void 0);
    return TokenSellConfigDto;
}());
exports.TokenSellConfigDto = TokenSellConfigDto;
var SellTokensDto = /** @class */ (function () {
    function SellTokensDto() {
    }
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsString)({ each: true }),
        __metadata("design:type", Array)
    ], SellTokensDto.prototype, "walletAddresses", void 0);
    __decorate([
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return TokenSellConfigDto; }),
        __metadata("design:type", TokenSellConfigDto)
    ], SellTokensDto.prototype, "tokenConfig", void 0);
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsNumber)({}, { each: true }),
        __metadata("design:type", Array)
    ], SellTokensDto.prototype, "customPercentages", void 0);
    return SellTokensDto;
}());
exports.SellTokensDto = SellTokensDto;
