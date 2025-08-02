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
exports.RaydiumController = void 0;
var common_1 = require("@nestjs/common");
var raydium_service_1 = require("./raydium.service");
var get_token_analysis_dto_1 = require("./dto/get-token-analysis.dto");
var get_pools_by_mint_dto_1 = require("./dto/get-pools-by-mint.dto");
var find_best_pool_dto_1 = require("./dto/find-best-pool.dto");
var get_pool_liquidity_dto_1 = require("./dto/get-pool-liquidity.dto");
var clear_cache_dto_1 = require("./dto/clear-cache.dto");
var RaydiumController = /** @class */ (function () {
    function RaydiumController(raydiumService) {
        this.raydiumService = raydiumService;
    }
    RaydiumController.prototype.getMainInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.raydiumService.getMainInfo()];
                    case 1:
                        info = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: info,
                                timestamp: new Date().toISOString()
                            }];
                }
            });
        });
    };
    RaydiumController.prototype.getTokenAnalysis = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var analysis;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.raydiumService.getTokenAnalysis(dto.mintAddress)];
                    case 1:
                        analysis = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: analysis,
                                timestamp: new Date().toISOString()
                            }];
                }
            });
        });
    };
    RaydiumController.prototype.getTokenPrices = function (mints) {
        return __awaiter(this, void 0, void 0, function () {
            var prices;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.raydiumService.getTokenPrices(mints)];
                    case 1:
                        prices = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: prices,
                                timestamp: new Date().toISOString()
                            }];
                }
            });
        });
    };
    RaydiumController.prototype.searchPools = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var pools;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.raydiumService.getPoolsByMint(dto.mint1, dto.mint2, dto.poolType, dto.pageSize)];
                    case 1:
                        pools = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: pools,
                                count: pools.length,
                                timestamp: new Date().toISOString()
                            }];
                }
            });
        });
    };
    RaydiumController.prototype.findBestPool = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var bestPool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.raydiumService.findBestPool(dto.mintA, dto.mintB)];
                    case 1:
                        bestPool = _a.sent();
                        if (!bestPool) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: 'No pools found for this token pair',
                                    timestamp: new Date().toISOString()
                                }];
                        }
                        return [2 /*return*/, {
                                success: true,
                                data: bestPool,
                                timestamp: new Date().toISOString()
                            }];
                }
            });
        });
    };
    RaydiumController.prototype.getPoolLiquidityHistory = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var history;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.raydiumService.getPoolLiquidityHistory(dto.poolId)];
                    case 1:
                        history = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: history,
                                timestamp: new Date().toISOString()
                            }];
                }
            });
        });
    };
    RaydiumController.prototype.getPoolsInfo = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var pools;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.raydiumService.getPoolsInfo(ids)];
                    case 1:
                        pools = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: pools,
                                count: pools.length,
                                timestamp: new Date().toISOString()
                            }];
                }
            });
        });
    };
    RaydiumController.prototype.getPoolKeys = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var keys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.raydiumService.getPoolKeys(ids)];
                    case 1:
                        keys = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: keys,
                                count: keys.length,
                                timestamp: new Date().toISOString()
                            }];
                }
            });
        });
    };
    RaydiumController.prototype.getDefaultMintList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mintList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.raydiumService.getDefaultMintList()];
                    case 1:
                        mintList = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: mintList,
                                timestamp: new Date().toISOString()
                            }];
                }
            });
        });
    };
    RaydiumController.prototype.getTokenInfo = function (mints) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.raydiumService.getMintInfo(mints)];
                    case 1:
                        tokens = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: tokens,
                                count: tokens.length,
                                timestamp: new Date().toISOString()
                            }];
                }
            });
        });
    };
    RaydiumController.prototype.clearCache = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.raydiumService.clearCache(dto.pattern)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                message: 'Cache cleared successfully',
                                pattern: dto.pattern || 'all',
                                timestamp: new Date().toISOString()
                            }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)('info'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], RaydiumController.prototype, "getMainInfo", null);
    __decorate([
        (0, common_1.Get)('tokens/:mintAddress'),
        __param(0, (0, common_1.Param)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [get_token_analysis_dto_1.GetTokenAnalysisDto]),
        __metadata("design:returntype", Promise)
    ], RaydiumController.prototype, "getTokenAnalysis", null);
    __decorate([
        (0, common_1.Get)('prices'),
        __param(0, (0, common_1.Query)('mints', new common_1.ParseArrayPipe({ items: String, separator: ',' }))),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], RaydiumController.prototype, "getTokenPrices", null);
    __decorate([
        (0, common_1.Get)('pools/search'),
        __param(0, (0, common_1.Query)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [get_pools_by_mint_dto_1.GetPoolsByMintDto]),
        __metadata("design:returntype", Promise)
    ], RaydiumController.prototype, "searchPools", null);
    __decorate([
        (0, common_1.Get)('pools/best'),
        __param(0, (0, common_1.Query)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [find_best_pool_dto_1.FindBestPoolDto]),
        __metadata("design:returntype", Promise)
    ], RaydiumController.prototype, "findBestPool", null);
    __decorate([
        (0, common_1.Get)('pools/:poolId/liquidity'),
        __param(0, (0, common_1.Param)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [get_pool_liquidity_dto_1.GetPoolLiquidityDto]),
        __metadata("design:returntype", Promise)
    ], RaydiumController.prototype, "getPoolLiquidityHistory", null);
    __decorate([
        (0, common_1.Get)('pools/info'),
        __param(0, (0, common_1.Query)('ids', new common_1.ParseArrayPipe({ items: String, separator: ',' }))),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], RaydiumController.prototype, "getPoolsInfo", null);
    __decorate([
        (0, common_1.Get)('pools/keys'),
        __param(0, (0, common_1.Query)('ids', new common_1.ParseArrayPipe({ items: String, separator: ',' }))),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], RaydiumController.prototype, "getPoolKeys", null);
    __decorate([
        (0, common_1.Get)('tokens/list'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], RaydiumController.prototype, "getDefaultMintList", null);
    __decorate([
        (0, common_1.Get)('tokens/info'),
        __param(0, (0, common_1.Query)('mints', new common_1.ParseArrayPipe({ items: String, separator: ',' }))),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], RaydiumController.prototype, "getTokenInfo", null);
    __decorate([
        (0, common_1.Delete)('cache'),
        __param(0, (0, common_1.Query)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [clear_cache_dto_1.ClearCacheDto]),
        __metadata("design:returntype", Promise)
    ], RaydiumController.prototype, "clearCache", null);
    RaydiumController = __decorate([
        (0, common_1.Controller)('raydium'),
        __metadata("design:paramtypes", [raydium_service_1.RaydiumService])
    ], RaydiumController);
    return RaydiumController;
}());
exports.RaydiumController = RaydiumController;
