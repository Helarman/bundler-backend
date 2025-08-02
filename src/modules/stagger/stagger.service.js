"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.StaggerService = void 0;
var common_1 = require("@nestjs/common");
var event_emitter_1 = require("@nestjs/event-emitter");
var jeton_service_1 = require("../jeton/jeton.service");
var StaggerService = /** @class */ (function () {
    function StaggerService(jetonService, eventEmitter) {
        this.jetonService = jetonService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(StaggerService_1.name);
        this.operations = new Map();
        this.runningOperations = new Set();
        this.executionQueue = [];
        this.config = {
            maxConcurrentOperations: 5,
            defaultDelay: 2000,
            minDelay: 500,
            maxDelay: 30000,
            retryDelay: 5000,
            maxRetries: 3,
            enablePriorityQueuing: true,
            enableAutoRetry: true
        };
    }
    StaggerService_1 = StaggerService;
    StaggerService.prototype.onModuleInit = function () {
        this.startExecutionLoop();
        this.logger.log('Stagger Service initialized', {
            maxConcurrentOperations: this.config.maxConcurrentOperations,
            enablePriorityQueuing: this.config.enablePriorityQueuing
        });
    };
    StaggerService.prototype.addOperation = function (type, parameters, options) {
        if (options === void 0) { options = {}; }
        var id = this.generateOperationId();
        var now = new Date();
        var scheduledAt = options.executeAt || new Date(now.getTime() + (options.delay || this.config.defaultDelay));
        var operation = {
            id: id,
            type: type,
            parameters: parameters,
            delay: options.delay || this.config.defaultDelay,
            priority: options.priority || 'medium',
            status: 'pending',
            createdAt: now,
            scheduledAt: scheduledAt,
            retryCount: 0,
            maxRetries: options.maxRetries || this.config.maxRetries
        };
        this.operations.set(id, operation);
        this.addToQueue(id);
        this.logger.log('Stagger operation added', {
            id: id,
            type: type,
            priority: operation.priority,
            scheduledAt: scheduledAt.toISOString(),
            delay: operation.delay
        });
        this.eventEmitter.emit('operation.added', operation);
        return id;
    };
    StaggerService.prototype.addBatchOperations = function (operations, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var ids = [];
        var baseDelay = options.staggerDelay || this.config.defaultDelay;
        operations.forEach(function (op, index) {
            var delay = baseDelay + (index * 1000);
            var id = _this.addOperation(op.type, op.parameters, {
                delay: delay,
                priority: op.priority || options.priority
            });
            ids.push(id);
        });
        this.logger.log('Batch stagger operations added', {
            count: operations.length,
            ids: ids.slice(0, 3).concat(ids.length > 3 ? ['...'] : [])
        });
        return ids;
    };
    StaggerService.prototype.cancelOperation = function (id) {
        var operation = this.operations.get(id);
        if (!operation || operation.status === 'running') {
            return false;
        }
        operation.status = 'cancelled';
        operation.completedAt = new Date();
        var queueIndex = this.executionQueue.indexOf(id);
        if (queueIndex > -1) {
            this.executionQueue.splice(queueIndex, 1);
        }
        this.logger.log('Operation cancelled', { id: id });
        this.eventEmitter.emit('operation.cancelled', operation);
        return true;
    };
    StaggerService.prototype.getOperation = function (id) {
        return this.operations.get(id);
    };
    StaggerService.prototype.getOperations = function (filter) {
        var operations = Array.from(this.operations.values());
        if (filter) {
            if (filter.status) {
                operations = operations.filter(function (op) { return op.status === filter.status; });
            }
            if (filter.type) {
                operations = operations.filter(function (op) { return op.type === filter.type; });
            }
            if (filter.priority) {
                operations = operations.filter(function (op) { return op.priority === filter.priority; });
            }
        }
        return operations.sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); });
    };
    StaggerService.prototype.getStats = function () {
        var operations = Array.from(this.operations.values());
        var completedOps = operations.filter(function (op) { return op.status === 'completed'; });
        var executionTimes = completedOps
            .filter(function (op) { return op.executedAt && op.completedAt; })
            .map(function (op) { return op.completedAt.getTime() - op.executedAt.getTime(); });
        return {
            totalOperations: operations.length,
            pendingOperations: operations.filter(function (op) { return op.status === 'pending'; }).length,
            runningOperations: operations.filter(function (op) { return op.status === 'running'; }).length,
            completedOperations: completedOps.length,
            failedOperations: operations.filter(function (op) { return op.status === 'failed'; }).length,
            cancelledOperations: operations.filter(function (op) { return op.status === 'cancelled'; }).length,
            averageExecutionTime: executionTimes.length > 0
                ? executionTimes.reduce(function (sum, time) { return sum + time; }, 0) / executionTimes.length
                : 0,
            successRate: operations.length > 0
                ? (completedOps.length / operations.length) * 100
                : 0
        };
    };
    StaggerService.prototype.updateConfig = function (newConfig) {
        this.config = __assign(__assign({}, this.config), newConfig);
        this.logger.log('Stagger configuration updated', newConfig);
        this.eventEmitter.emit('config.updated', this.config);
    };
    StaggerService.prototype.cleanup = function (olderThanHours) {
        var _this = this;
        if (olderThanHours === void 0) { olderThanHours = 24; }
        var cutoffTime = new Date(Date.now() - (olderThanHours * 60 * 60 * 1000));
        var toDelete = [];
        this.operations.forEach(function (operation, id) {
            if ((operation.status === 'completed' || operation.status === 'failed' || operation.status === 'cancelled') &&
                operation.completedAt &&
                operation.completedAt < cutoffTime) {
                toDelete.push(id);
            }
        });
        toDelete.forEach(function (id) { return _this.operations.delete(id); });
        this.logger.log('Cleaned up old operations', {
            deleted: toDelete.length,
            olderThanHours: olderThanHours
        });
        return toDelete.length;
    };
    StaggerService.prototype.addToQueue = function (id) {
        if (this.config.enablePriorityQueuing) {
            var operation = this.operations.get(id);
            var priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
            var insertIndex = this.executionQueue.length;
            for (var i = 0; i < this.executionQueue.length; i++) {
                var queuedOp = this.operations.get(this.executionQueue[i]);
                if (priorityOrder[operation.priority] < priorityOrder[queuedOp.priority]) {
                    insertIndex = i;
                    break;
                }
            }
            this.executionQueue.splice(insertIndex, 0, id);
        }
        else {
            this.executionQueue.push(id);
        }
    };
    StaggerService.prototype.startExecutionLoop = function () {
        var _this = this;
        setInterval(function () {
            _this.processQueue();
        }, 1000);
    };
    StaggerService.prototype.processQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, availableSlots, toExecute, i, id, operation;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.runningOperations.size >= this.config.maxConcurrentOperations) {
                    return [2 /*return*/];
                }
                now = new Date();
                availableSlots = this.config.maxConcurrentOperations - this.runningOperations.size;
                toExecute = [];
                for (i = 0; i < this.executionQueue.length && toExecute.length < availableSlots; i++) {
                    id = this.executionQueue[i];
                    operation = this.operations.get(id);
                    if (!operation || operation.status !== 'pending') {
                        this.executionQueue.splice(i, 1);
                        i--;
                        continue;
                    }
                    if (operation.scheduledAt <= now) {
                        toExecute.push(id);
                        this.executionQueue.splice(i, 1);
                        i--;
                    }
                }
                toExecute.forEach(function (id) {
                    _this.executeOperation(id);
                });
                return [2 /*return*/];
            });
        });
    };
    StaggerService.prototype.executeOperation = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var operation, result, _a, error_1, errorMessage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        operation = this.operations.get(id);
                        if (!operation)
                            return [2 /*return*/];
                        this.runningOperations.add(id);
                        operation.status = 'running';
                        operation.executedAt = new Date();
                        this.logger.log('Executing stagger operation', {
                            id: id,
                            type: operation.type,
                            priority: operation.priority
                        });
                        this.eventEmitter.emit('operation.started', operation);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 14, 15, 16]);
                        result = void 0;
                        _a = operation.type;
                        switch (_a) {
                            case 'buy': return [3 /*break*/, 2];
                            case 'sell': return [3 /*break*/, 4];
                            case 'transfer': return [3 /*break*/, 6];
                            case 'distribute': return [3 /*break*/, 8];
                            case 'consolidate': return [3 /*break*/, 10];
                        }
                        return [3 /*break*/, 12];
                    case 2: return [4 /*yield*/, this.executeBuyOperation(operation.parameters)];
                    case 3:
                        result = _b.sent();
                        return [3 /*break*/, 13];
                    case 4: return [4 /*yield*/, this.executeSellOperation(operation.parameters)];
                    case 5:
                        result = _b.sent();
                        return [3 /*break*/, 13];
                    case 6: return [4 /*yield*/, this.executeTransferOperation(operation.parameters)];
                    case 7:
                        result = _b.sent();
                        return [3 /*break*/, 13];
                    case 8: return [4 /*yield*/, this.executeDistributeOperation(operation.parameters)];
                    case 9:
                        result = _b.sent();
                        return [3 /*break*/, 13];
                    case 10: return [4 /*yield*/, this.executeConsolidateOperation(operation.parameters)];
                    case 11:
                        result = _b.sent();
                        return [3 /*break*/, 13];
                    case 12: throw new Error("Unknown operation type: ".concat(operation.type));
                    case 13:
                        operation.status = 'completed';
                        operation.result = result;
                        operation.completedAt = new Date();
                        this.logger.log('Stagger operation completed', {
                            id: id,
                            type: operation.type,
                            executionTime: operation.completedAt.getTime() - operation.executedAt.getTime()
                        });
                        this.eventEmitter.emit('operation.completed', operation);
                        return [3 /*break*/, 16];
                    case 14:
                        error_1 = _b.sent();
                        errorMessage = error_1 instanceof Error ? error_1.message : 'Unknown error';
                        operation.error = errorMessage;
                        operation.retryCount++;
                        if (this.config.enableAutoRetry && operation.retryCount < operation.maxRetries) {
                            operation.status = 'pending';
                            operation.scheduledAt = new Date(Date.now() + this.config.retryDelay);
                            this.addToQueue(id);
                            this.logger.warn('Stagger operation failed, scheduling retry', {
                                id: id,
                                error: errorMessage,
                                retryCount: operation.retryCount,
                                maxRetries: operation.maxRetries
                            });
                            this.eventEmitter.emit('operation.retry', operation);
                        }
                        else {
                            operation.status = 'failed';
                            operation.completedAt = new Date();
                            this.logger.error('Stagger operation failed permanently', {
                                id: id,
                                error: errorMessage,
                                retryCount: operation.retryCount
                            });
                            this.eventEmitter.emit('operation.failed', operation);
                        }
                        return [3 /*break*/, 16];
                    case 15:
                        this.runningOperations.delete(id);
                        return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    StaggerService.prototype.executeBuyOperation = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.jetonService.buyTokens(params.walletAddresses, params.tokenConfig, params.customAmounts)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StaggerService.prototype.executeSellOperation = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.jetonService.sellTokens(params.walletAddresses, params.tokenConfig, params.customPercentages)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StaggerService.prototype.executeTransferOperation = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.jetonService.transferTokens(params.senderPublicKey, params.receiver, params.tokenAddress, params.amount)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StaggerService.prototype.executeDistributeOperation = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.jetonService.distributeSOL(params.wallets, params.amount)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StaggerService.prototype.executeConsolidateOperation = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.jetonService.consolidateSOL(params.wallets, params.targetWallet, params.amount)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StaggerService.prototype.generateOperationId = function () {
        return "stagger_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
    };
    var StaggerService_1;
    StaggerService = StaggerService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [jeton_service_1.JetonService,
            event_emitter_1.EventEmitter2])
    ], StaggerService);
    return StaggerService;
}());
exports.StaggerService = StaggerService;
