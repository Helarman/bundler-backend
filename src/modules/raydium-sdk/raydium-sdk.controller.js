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
exports.RaydiumSdkController = void 0;
var common_1 = require("@nestjs/common");
var raydium_sdk_service_1 = require("./raydium-sdk.service");
var swap_params_dto_1 = require("./dto/swap-params.dto");
var create_cpmm_pool_dto_1 = require("./dto/create-cpmm-pool.dto");
var create_clmm_pool_dto_1 = require("./dto/create-clmm-pool.dto");
var create_amm_pool_dto_1 = require("./dto/create-amm-pool.dto");
var RaydiumSdkController = /** @class */ (function () {
    function RaydiumSdkController(raydiumService) {
        this.raydiumService = raydiumService;
    }
    RaydiumSdkController.prototype.routeSwap = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.raydiumService.routeSwap(params)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw new common_1.HttpException(error_1.message || 'Route swap failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkController.prototype.cpmmSwap = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!params.poolId) {
                            throw new common_1.HttpException('poolId is required for CPMM swap', common_1.HttpStatus.BAD_REQUEST);
                        }
                        return [4 /*yield*/, this.raydiumService.cpmmSwap(params)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        throw new common_1.HttpException(error_2.message || 'CPMM swap failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkController.prototype.clmmSwap = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!params.poolId) {
                            throw new common_1.HttpException('poolId is required for CLMM swap', common_1.HttpStatus.BAD_REQUEST);
                        }
                        return [4 /*yield*/, this.raydiumService.clmmSwap(params)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        throw new common_1.HttpException(error_3.message || 'CLMM swap failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkController.prototype.getPools = function (mintA, mintB) {
        return __awaiter(this, void 0, void 0, function () {
            var pools, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.raydiumService.getPoolsForPair(mintA, mintB)];
                    case 1:
                        pools = _a.sent();
                        return [2 /*return*/, { pools: pools, count: pools.length }];
                    case 2:
                        error_4 = _a.sent();
                        throw new common_1.HttpException(error_4.message || 'Failed to get pools', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkController.prototype.clearCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    this.raydiumService.clearCache();
                    return [2 /*return*/, { success: true, message: 'Cache cleared successfully' }];
                }
                catch (error) {
                    throw new common_1.HttpException(error.message || 'Failed to clear cache', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return [2 /*return*/];
            });
        });
    };
    RaydiumSdkController.prototype.getStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        success: true,
                        data: {
                            status: 'ready',
                            cluster: process.env.NODE_ENV === 'development' ? 'devnet' : 'mainnet',
                            rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
                            features: [
                                'route-swap',
                                'cpmm-swap',
                                'clmm-swap',
                                'pool-discovery',
                                'pool-creation-cpmm',
                                'pool-creation-clmm',
                                'pool-creation-amm',
                                'config-management',
                                'cache-management'
                            ]
                        }
                    }];
            });
        });
    };
    RaydiumSdkController.prototype.createCpmmPool = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.raydiumService.createCpmmPool(params)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        throw new common_1.HttpException(error_5.message || 'CPMM pool creation failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkController.prototype.createClmmPool = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.raydiumService.createClmmPool(params)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        throw new common_1.HttpException(error_6.message || 'CLMM pool creation failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkController.prototype.createAmmPool = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.raydiumService.createAmmPool(params)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        throw new common_1.HttpException(error_7.message || 'AMM pool creation failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkController.prototype.getCpmmConfigs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var configs, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.raydiumService.getCpmmFeeConfigs()];
                    case 1:
                        configs = _a.sent();
                        return [2 /*return*/, { configs: configs, count: configs.length }];
                    case 2:
                        error_8 = _a.sent();
                        throw new common_1.HttpException(error_8.message || 'Failed to get CPMM configs', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkController.prototype.getClmmConfigs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var configs, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.raydiumService.getClmmConfigs()];
                    case 1:
                        configs = _a.sent();
                        return [2 /*return*/, { configs: configs, count: configs.length }];
                    case 2:
                        error_9 = _a.sent();
                        throw new common_1.HttpException(error_9.message || 'Failed to get CLMM configs', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Post)('swap/route'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [swap_params_dto_1.SwapParamsDto]),
        __metadata("design:returntype", Promise)
    ], RaydiumSdkController.prototype, "routeSwap", null);
    __decorate([
        (0, common_1.Post)('swap/cpmm'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], RaydiumSdkController.prototype, "cpmmSwap", null);
    __decorate([
        (0, common_1.Post)('swap/clmm'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], RaydiumSdkController.prototype, "clmmSwap", null);
    __decorate([
        (0, common_1.Get)('pools'),
        __param(0, (0, common_1.Query)('mintA')),
        __param(1, (0, common_1.Query)('mintB')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], RaydiumSdkController.prototype, "getPools", null);
    __decorate([
        (0, common_1.Post)('cache/clear'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], RaydiumSdkController.prototype, "clearCache", null);
    __decorate([
        (0, common_1.Get)('status'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], RaydiumSdkController.prototype, "getStatus", null);
    __decorate([
        (0, common_1.Post)('pools/create/cpmm'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [create_cpmm_pool_dto_1.CreateCpmmPoolDto]),
        __metadata("design:returntype", Promise)
    ], RaydiumSdkController.prototype, "createCpmmPool", null);
    __decorate([
        (0, common_1.Post)('pools/create/clmm'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [create_clmm_pool_dto_1.CreateClmmPoolDto]),
        __metadata("design:returntype", Promise)
    ], RaydiumSdkController.prototype, "createClmmPool", null);
    __decorate([
        (0, common_1.Post)('pools/create/amm'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [create_amm_pool_dto_1.CreateAmmPoolDto]),
        __metadata("design:returntype", Promise)
    ], RaydiumSdkController.prototype, "createAmmPool", null);
    __decorate([
        (0, common_1.Get)('configs/cpmm'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], RaydiumSdkController.prototype, "getCpmmConfigs", null);
    __decorate([
        (0, common_1.Get)('configs/clmm'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], RaydiumSdkController.prototype, "getClmmConfigs", null);
    RaydiumSdkController = __decorate([
        (0, common_1.Controller)('raydium-sdk'),
        __metadata("design:paramtypes", [raydium_sdk_service_1.RaydiumSdkService])
    ], RaydiumSdkController);
    return RaydiumSdkController;
}());
exports.RaydiumSdkController = RaydiumSdkController;
