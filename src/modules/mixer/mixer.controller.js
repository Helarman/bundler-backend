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
exports.MixerController = void 0;
var common_1 = require("@nestjs/common");
var mixer_service_1 = require("./mixer.service");
var config_dto_1 = require("./dto/config.dto");
var mixer_dto_1 = require("./dto/mixer.dto");
var MixerController = /** @class */ (function () {
    function MixerController(mixerService) {
        this.mixerService = mixerService;
    }
    MixerController.prototype.singleMix = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var configValidation, result, error_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        if (body.config) {
                            configValidation = this.mixerService.validateMixerConfig(body.config);
                            if (!configValidation.valid) {
                                throw new common_1.HttpException({
                                    success: false,
                                    error: configValidation.error,
                                    code: 'INVALID_CONFIG'
                                }, common_1.HttpStatus.BAD_REQUEST);
                            }
                        }
                        return [4 /*yield*/, this.mixerService.mixSOLSingle(body.sender, body.recipient, body.config)];
                    case 1:
                        result = _d.sent();
                        if (!result.success) {
                            throw new common_1.HttpException({
                                success: false,
                                error: result.error || 'Mixing operation failed',
                                code: 'MIXING_ERROR'
                            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                        }
                        return [2 /*return*/, {
                                success: true,
                                totalMixed: result.totalMixed,
                                stepsExecuted: result.steps.length,
                                mixingRounds: ((_a = result.steps[result.steps.length - 1]) === null || _a === void 0 ? void 0 : _a.round) || 0,
                                steps: result.steps.map(function (step) { return ({
                                    round: step.round,
                                    amount: step.amount,
                                    delay: step.delay
                                }); })
                            }];
                    case 2:
                        error_1 = _d.sent();
                        throw new common_1.HttpException({
                            success: false,
                            error: ((_b = error_1.response) === null || _b === void 0 ? void 0 : _b.error) || 'Internal server error',
                            code: ((_c = error_1.response) === null || _c === void 0 ? void 0 : _c.code) || 'INTERNAL_ERROR'
                        }, error_1.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MixerController.prototype.batchMix = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var configValidation, results, successfulMixes, failedMixes, totalMixed, error_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        if (body.config) {
                            configValidation = this.mixerService.validateMixerConfig(body.config);
                            if (!configValidation.valid) {
                                throw new common_1.HttpException({
                                    success: false,
                                    error: configValidation.error,
                                    code: 'INVALID_CONFIG'
                                }, common_1.HttpStatus.BAD_REQUEST);
                            }
                        }
                        return [4 /*yield*/, this.mixerService.mixSOLBatch(body.sender, body.recipients, body.config)];
                    case 1:
                        results = _c.sent();
                        successfulMixes = results.filter(function (r) { return r.success; });
                        failedMixes = results.filter(function (r) { return !r.success; });
                        totalMixed = successfulMixes.reduce(function (sum, r) { return sum + r.totalMixed; }, 0);
                        return [2 /*return*/, {
                                success: true,
                                totalMixed: totalMixed,
                                successfulMixes: successfulMixes.length,
                                failedMixes: failedMixes.length,
                                totalRecipients: body.recipients.length,
                                results: results.map(function (result, index) { return ({
                                    recipientIndex: index,
                                    success: result.success,
                                    totalMixed: result.totalMixed,
                                    stepsExecuted: result.steps.length,
                                    error: result.error
                                }); })
                            }];
                    case 2:
                        error_2 = _c.sent();
                        throw new common_1.HttpException({
                            success: false,
                            error: ((_a = error_2.response) === null || _a === void 0 ? void 0 : _a.error) || 'Internal server error',
                            code: ((_b = error_2.response) === null || _b === void 0 ? void 0 : _b.code) || 'INTERNAL_ERROR'
                        }, error_2.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MixerController.prototype.getStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.mixerService.getMixerStats()];
            });
        });
    };
    MixerController.prototype.validateConfig = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var validation;
            return __generator(this, function (_a) {
                validation = this.mixerService.validateMixerConfig(body);
                return [2 /*return*/, {
                        valid: validation.valid,
                        error: validation.error,
                        config: body
                    }];
            });
        });
    };
    __decorate([
        (0, common_1.Post)('single'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [mixer_dto_1.SingleMixRequestDto]),
        __metadata("design:returntype", Promise)
    ], MixerController.prototype, "singleMix", null);
    __decorate([
        (0, common_1.Post)('batch'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [mixer_dto_1.BatchMixRequestDto]),
        __metadata("design:returntype", Promise)
    ], MixerController.prototype, "batchMix", null);
    __decorate([
        (0, common_1.Get)('stats'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], MixerController.prototype, "getStats", null);
    __decorate([
        (0, common_1.Post)('config/validate'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [config_dto_1.MixerConfigDto]),
        __metadata("design:returntype", Promise)
    ], MixerController.prototype, "validateConfig", null);
    MixerController = __decorate([
        (0, common_1.Controller)('mixer'),
        __metadata("design:paramtypes", [mixer_service_1.MixerService])
    ], MixerController);
    return MixerController;
}());
exports.MixerController = MixerController;
