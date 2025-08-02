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
exports.UpdateConfigDto = void 0;
var class_validator_1 = require("class-validator");
var UpdateConfigDto = /** @class */ (function () {
    function UpdateConfigDto() {
    }
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.Min)(1),
        (0, class_validator_1.Max)(20),
        __metadata("design:type", Number)
    ], UpdateConfigDto.prototype, "maxConcurrentOperations", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.Min)(500),
        (0, class_validator_1.Max)(60000),
        __metadata("design:type", Number)
    ], UpdateConfigDto.prototype, "defaultDelay", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.Min)(100),
        (0, class_validator_1.Max)(30000),
        __metadata("design:type", Number)
    ], UpdateConfigDto.prototype, "minDelay", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.Min)(1000),
        (0, class_validator_1.Max)(300000),
        __metadata("design:type", Number)
    ], UpdateConfigDto.prototype, "maxDelay", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.Min)(1000),
        (0, class_validator_1.Max)(60000),
        __metadata("design:type", Number)
    ], UpdateConfigDto.prototype, "retryDelay", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.Min)(0),
        (0, class_validator_1.Max)(10),
        __metadata("design:type", Number)
    ], UpdateConfigDto.prototype, "maxRetries", void 0);
    __decorate([
        (0, class_validator_1.IsBoolean)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Boolean)
    ], UpdateConfigDto.prototype, "enablePriorityQueuing", void 0);
    __decorate([
        (0, class_validator_1.IsBoolean)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Boolean)
    ], UpdateConfigDto.prototype, "enableAutoRetry", void 0);
    return UpdateConfigDto;
}());
exports.UpdateConfigDto = UpdateConfigDto;
