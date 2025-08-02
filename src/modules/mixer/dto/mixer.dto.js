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
exports.BatchMixResponseDto = exports.MixResponseDto = exports.BatchMixRequestDto = exports.SingleMixRequestDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var config_dto_1 = require("./config.dto");
var MixerWalletDto = /** @class */ (function () {
    function MixerWalletDto() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        __metadata("design:type", String)
    ], MixerWalletDto.prototype, "privateKey", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], MixerWalletDto.prototype, "amount", void 0);
    return MixerWalletDto;
}());
var SingleMixRequestDto = /** @class */ (function () {
    function SingleMixRequestDto() {
    }
    __decorate([
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return MixerWalletDto; }),
        __metadata("design:type", MixerWalletDto)
    ], SingleMixRequestDto.prototype, "sender", void 0);
    __decorate([
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return MixerWalletDto; }),
        __metadata("design:type", MixerWalletDto)
    ], SingleMixRequestDto.prototype, "recipient", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", config_dto_1.MixerConfigDto)
    ], SingleMixRequestDto.prototype, "config", void 0);
    return SingleMixRequestDto;
}());
exports.SingleMixRequestDto = SingleMixRequestDto;
var BatchMixRequestDto = /** @class */ (function () {
    function BatchMixRequestDto() {
    }
    __decorate([
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return MixerWalletDto; }),
        __metadata("design:type", MixerWalletDto)
    ], BatchMixRequestDto.prototype, "sender", void 0);
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.ValidateNested)({ each: true }),
        (0, class_transformer_1.Type)(function () { return MixerWalletDto; }),
        __metadata("design:type", Array)
    ], BatchMixRequestDto.prototype, "recipients", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", config_dto_1.MixerConfigDto)
    ], BatchMixRequestDto.prototype, "config", void 0);
    return BatchMixRequestDto;
}());
exports.BatchMixRequestDto = BatchMixRequestDto;
var MixResponseDto = /** @class */ (function () {
    function MixResponseDto() {
    }
    return MixResponseDto;
}());
exports.MixResponseDto = MixResponseDto;
var BatchMixResponseDto = /** @class */ (function () {
    function BatchMixResponseDto() {
    }
    return BatchMixResponseDto;
}());
exports.BatchMixResponseDto = BatchMixResponseDto;
