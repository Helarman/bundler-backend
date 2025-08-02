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
exports.BuyTokensDto = exports.TokenBuyConfigDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var TokenBuyConfigDto = /** @class */ (function () {
    function TokenBuyConfigDto() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], TokenBuyConfigDto.prototype, "tokenAddress", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], TokenBuyConfigDto.prototype, "protocol", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        __metadata("design:type", Number)
    ], TokenBuyConfigDto.prototype, "solAmount", void 0);
    return TokenBuyConfigDto;
}());
exports.TokenBuyConfigDto = TokenBuyConfigDto;
var BuyTokensDto = /** @class */ (function () {
    function BuyTokensDto() {
    }
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsString)({ each: true }),
        __metadata("design:type", Array)
    ], BuyTokensDto.prototype, "walletAddresses", void 0);
    __decorate([
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return TokenBuyConfigDto; }),
        __metadata("design:type", TokenBuyConfigDto)
    ], BuyTokensDto.prototype, "tokenConfig", void 0);
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsNumber)({}, { each: true }),
        __metadata("design:type", Array)
    ], BuyTokensDto.prototype, "customAmounts", void 0);
    return BuyTokensDto;
}());
exports.BuyTokensDto = BuyTokensDto;
