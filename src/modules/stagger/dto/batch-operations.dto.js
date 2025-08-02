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
exports.BatchOperationsDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var add_operation_dto_1 = require("./add-operation.dto");
var BatchOperationsDto = /** @class */ (function () {
    function BatchOperationsDto() {
    }
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.ValidateNested)({ each: true }),
        (0, class_transformer_1.Type)(function () { return add_operation_dto_1.AddOperationDto; }),
        __metadata("design:type", Array)
    ], BatchOperationsDto.prototype, "operations", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.Min)(500),
        (0, class_validator_1.Max)(60000),
        __metadata("design:type", Number)
    ], BatchOperationsDto.prototype, "staggerDelay", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsIn)(['low', 'medium', 'high', 'urgent']),
        __metadata("design:type", String)
    ], BatchOperationsDto.prototype, "priority", void 0);
    return BatchOperationsDto;
}());
exports.BatchOperationsDto = BatchOperationsDto;
