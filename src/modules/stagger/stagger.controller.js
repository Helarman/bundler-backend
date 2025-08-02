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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaggerController = void 0;
var common_1 = require("@nestjs/common");
var stagger_service_1 = require("./stagger.service");
var add_operation_dto_1 = require("./dto/add-operation.dto");
var batch_operations_dto_1 = require("./dto/batch-operations.dto");
var update_config_dto_1 = require("./dto/update-config.dto");
var cleanup_dto_1 = require("./dto/cleanup.dto");
var StaggerController = /** @class */ (function () {
    function StaggerController(staggerService) {
        this.staggerService = staggerService;
    }
    StaggerController.prototype.addOperation = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var type, parameters, delay, priority, maxRetries, executeAt, operationId;
            return __generator(this, function (_a) {
                type = dto.type, parameters = dto.parameters, delay = dto.delay, priority = dto.priority, maxRetries = dto.maxRetries, executeAt = dto.executeAt;
                operationId = this.staggerService.addOperation(type, parameters, {
                    delay: delay,
                    priority: priority,
                    maxRetries: maxRetries,
                    executeAt: executeAt ? new Date(executeAt) : undefined
                });
                return [2 /*return*/, {
                        success: true,
                        data: {
                            operationId: operationId,
                            type: type,
                            priority: priority || 'medium',
                            delay: delay || 2000,
                            scheduledAt: executeAt || new Date(Date.now() + (delay || 2000))
                        },
                        message: 'Operation added to stagger queue'
                    }];
            });
        });
    };
    StaggerController.prototype.addBatchOperations = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var operations, staggerDelay, priority, operationIds;
            return __generator(this, function (_a) {
                operations = dto.operations, staggerDelay = dto.staggerDelay, priority = dto.priority;
                operationIds = this.staggerService.addBatchOperations(operations, {
                    staggerDelay: staggerDelay,
                    priority: priority
                });
                return [2 /*return*/, {
                        success: true,
                        data: {
                            operationIds: operationIds,
                            count: operations.length,
                            staggerDelay: staggerDelay || 2000,
                            priority: priority || 'medium'
                        },
                        message: "".concat(operations.length, " operations added to stagger queue")
                    }];
            });
        });
    };
    StaggerController.prototype.cancelOperation = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cancelled;
            return __generator(this, function (_a) {
                cancelled = this.staggerService.cancelOperation(id);
                if (!cancelled) {
                    return [2 /*return*/, {
                            success: false,
                            error: 'Operation not found or cannot be cancelled',
                            code: 'OPERATION_NOT_FOUND'
                        }];
                }
                return [2 /*return*/, {
                        success: true,
                        data: { operationId: id },
                        message: 'Operation cancelled successfully'
                    }];
            });
        });
    };
    StaggerController.prototype.getOperationStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var operation;
            return __generator(this, function (_a) {
                operation = this.staggerService.getOperation(id);
                if (!operation) {
                    return [2 /*return*/, {
                            success: false,
                            error: 'Operation not found',
                            code: 'OPERATION_NOT_FOUND'
                        }];
                }
                return [2 /*return*/, {
                        success: true,
                        data: {
                            id: operation.id,
                            type: operation.type,
                            status: operation.status,
                            priority: operation.priority,
                            createdAt: operation.createdAt,
                            scheduledAt: operation.scheduledAt,
                            executedAt: operation.executedAt,
                            completedAt: operation.completedAt,
                            retryCount: operation.retryCount,
                            maxRetries: operation.maxRetries,
                            error: operation.error,
                            result: operation.result
                        },
                        message: 'Operation status retrieved'
                    }];
            });
        });
    };
    StaggerController.prototype.getOperations = function (status_1, type_1, priority_1) {
        return __awaiter(this, arguments, void 0, function (status, type, priority, limit, offset) {
            var operations, paginatedOps;
            if (limit === void 0) { limit = '50'; }
            if (offset === void 0) { offset = '0'; }
            return __generator(this, function (_a) {
                operations = this.staggerService.getOperations({
                    status: status,
                    type: type,
                    priority: priority
                });
                paginatedOps = operations.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
                return [2 /*return*/, {
                        success: true,
                        data: {
                            operations: paginatedOps.map(function (op) { return ({
                                id: op.id,
                                type: op.type,
                                status: op.status,
                                priority: op.priority,
                                createdAt: op.createdAt,
                                scheduledAt: op.scheduledAt,
                                executedAt: op.executedAt,
                                completedAt: op.completedAt,
                                retryCount: op.retryCount,
                                error: op.error
                            }); }),
                            total: operations.length,
                            limit: parseInt(limit),
                            offset: parseInt(offset)
                        },
                        message: 'Operations retrieved successfully'
                    }];
            });
        });
    };
    StaggerController.prototype.getStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stats;
            return __generator(this, function (_a) {
                stats = this.staggerService.getStats();
                return [2 /*return*/, {
                        success: true,
                        data: stats,
                        message: 'Stagger statistics retrieved successfully'
                    }];
            });
        });
    };
    StaggerController.prototype.updateConfig = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.staggerService.updateConfig(dto);
                return [2 /*return*/, {
                        success: true,
                        data: dto,
                        message: 'Configuration updated successfully'
                    }];
            });
        });
    };
    StaggerController.prototype.cleanup = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var deleted;
            return __generator(this, function (_a) {
                deleted = this.staggerService.cleanup(dto.olderThanHours);
                return [2 /*return*/, {
                        success: true,
                        data: {
                            deleted: deleted,
                            olderThanHours: dto.olderThanHours
                        },
                        message: "Cleaned up ".concat(deleted, " old operations")
                    }];
            });
        });
    };
    __decorate([
        (0, common_1.Post)('add'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [add_operation_dto_1.AddOperationDto]),
        __metadata("design:returntype", Promise)
    ], StaggerController.prototype, "addOperation", null);
    __decorate([
        (0, common_1.Post)('batch'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [batch_operations_dto_1.BatchOperationsDto]),
        __metadata("design:returntype", Promise)
    ], StaggerController.prototype, "addBatchOperations", null);
    __decorate([
        (0, common_1.Delete)('cancel/:id'),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], StaggerController.prototype, "cancelOperation", null);
    __decorate([
        (0, common_1.Get)('status/:id'),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], StaggerController.prototype, "getOperationStatus", null);
    __decorate([
        (0, common_1.Get)('operations'),
        __param(0, (0, common_1.Query)('status')),
        __param(1, (0, common_1.Query)('type')),
        __param(2, (0, common_1.Query)('priority')),
        __param(3, (0, common_1.Query)('limit')),
        __param(4, (0, common_1.Query)('offset')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], StaggerController.prototype, "getOperations", null);
    __decorate([
        (0, common_1.Get)('stats'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], StaggerController.prototype, "getStats", null);
    __decorate([
        (0, common_1.Post)('config'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [update_config_dto_1.UpdateConfigDto]),
        __metadata("design:returntype", Promise)
    ], StaggerController.prototype, "updateConfig", null);
    __decorate([
        (0, common_1.Post)('cleanup'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [cleanup_dto_1.CleanupDto]),
        __metadata("design:returntype", Promise)
    ], StaggerController.prototype, "cleanup", null);
    StaggerController = __decorate([
        (0, common_1.Controller)('stagger'),
        __metadata("design:paramtypes", [stagger_service_1.StaggerService])
    ], StaggerController);
    return StaggerController;
}());
exports.StaggerController = StaggerController;
