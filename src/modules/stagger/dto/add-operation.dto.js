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
exports.AddOperationDto = void 0;
var class_validator_1 = require("class-validator");
var AddOperationDto = /** @class */ (function () {
    function AddOperationDto() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsIn)(['buy', 'sell', 'transfer', 'distribute', 'consolidate']),
        __metadata("design:type", String)
    ], AddOperationDto.prototype, "type", void 0);
    __decorate([
        (0, class_validator_1.IsObject)(),
        __metadata("design:type", Object)
    ], AddOperationDto.prototype, "parameters", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.Min)(500),
        (0, class_validator_1.Max)(300000),
        __metadata("design:type", Number)
    ], AddOperationDto.prototype, "delay", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsIn)(['low', 'medium', 'high', 'urgent']),
        __metadata("design:type", String)
    ], AddOperationDto.prototype, "priority", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.Min)(0),
        (0, class_validator_1.Max)(10),
        __metadata("design:type", Number)
    ], AddOperationDto.prototype, "maxRetries", void 0);
    __decorate([
        (0, class_validator_1.IsDateString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], AddOperationDto.prototype, "executeAt", void 0);
    return AddOperationDto;
}());
exports.AddOperationDto = AddOperationDto;
