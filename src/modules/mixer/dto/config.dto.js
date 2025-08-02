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
exports.ConfigValidationResponseDto = exports.MixerConfigDto = void 0;
var class_validator_1 = require("class-validator");
var MixerConfigDto = /** @class */ (function () {
    function MixerConfigDto() {
    }
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.Min)(0.001),
        (0, class_validator_1.Max)(1),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Number)
    ], MixerConfigDto.prototype, "minAmount", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.Min)(0.001),
        (0, class_validator_1.Max)(10),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Number)
    ], MixerConfigDto.prototype, "maxAmount", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.Min)(100),
        (0, class_validator_1.Max)(30000),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Number)
    ], MixerConfigDto.prototype, "minDelay", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.Min)(100),
        (0, class_validator_1.Max)(60000),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Number)
    ], MixerConfigDto.prototype, "maxDelay", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.Min)(1),
        (0, class_validator_1.Max)(10),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Number)
    ], MixerConfigDto.prototype, "mixingRounds", void 0);
    __decorate([
        (0, class_validator_1.IsBoolean)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Boolean)
    ], MixerConfigDto.prototype, "useRandomAmounts", void 0);
    __decorate([
        (0, class_validator_1.IsBoolean)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Boolean)
    ], MixerConfigDto.prototype, "enableTimingVariation", void 0);
    return MixerConfigDto;
}());
exports.MixerConfigDto = MixerConfigDto;
var ConfigValidationResponseDto = /** @class */ (function () {
    function ConfigValidationResponseDto() {
    }
    return ConfigValidationResponseDto;
}());
exports.ConfigValidationResponseDto = ConfigValidationResponseDto;
