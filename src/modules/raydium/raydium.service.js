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
exports.RaydiumService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("@nestjs/axios");
var rxjs_1 = require("rxjs");
var RaydiumService = /** @class */ (function () {
    function RaydiumService(httpService, cacheManager) {
        this.httpService = httpService;
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(RaydiumService_1.name);
        this.baseURL = 'https://api-v3.raydium.io';
        this.logger.log('Raydium Service initialized', { baseURL: this.baseURL });
    }
    RaydiumService_1 = RaydiumService;
    RaydiumService.prototype.getMainInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = 'main_info';
                        return [4 /*yield*/, this.cacheManager.get(cacheKey)];
                    case 1:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.get("".concat(this.baseURL, "/main/info")))];
                    case 3:
                        response = _a.sent();
                        if (!response.data.success) {
                            throw new Error(response.data.msg || 'Failed to get main info');
                        }
                        data = response.data.data;
                        return [4 /*yield*/, this.cacheManager.set(cacheKey, data, 5 * 60 * 1000)];
                    case 4:
                        _a.sent(); // 5 minutes
                        this.logger.log('Retrieved Raydium main info', {
                            tvl: data.tvl,
                            volume24: data.volume24
                        });
                        return [2 /*return*/, data];
                    case 5:
                        error_1 = _a.sent();
                        this.logger.error('Failed to get Raydium main info:', error_1);
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumService.prototype.getMintInfo = function (mintAddresses) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, response, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = "mint_info_".concat(mintAddresses.join('_'));
                        return [4 /*yield*/, this.cacheManager.get(cacheKey)];
                    case 1:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.get("".concat(this.baseURL, "/mint/ids"), {
                                params: { mints: mintAddresses.join(',') }
                            }))];
                    case 3:
                        response = _a.sent();
                        if (!response.data.success) {
                            throw new Error(response.data.msg || 'Failed to get mint info');
                        }
                        data = response.data.data;
                        return [4 /*yield*/, this.cacheManager.set(cacheKey, data, 10 * 60 * 1000)];
                    case 4:
                        _a.sent(); // 10 minutes
                        this.logger.log('Retrieved Raydium mint info', {
                            count: data.length,
                            mints: mintAddresses.slice(0, 3)
                        });
                        return [2 /*return*/, data];
                    case 5:
                        error_2 = _a.sent();
                        this.logger.error('Failed to get Raydium mint info:', error_2);
                        throw error_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumService.prototype.getTokenPrices = function (mintAddresses) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, response, data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = "prices_".concat(mintAddresses.join('_'));
                        return [4 /*yield*/, this.cacheManager.get(cacheKey)];
                    case 1:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.get("".concat(this.baseURL, "/mint/price"), {
                                params: { mints: mintAddresses.join(',') }
                            }))];
                    case 3:
                        response = _a.sent();
                        if (!response.data.success) {
                            throw new Error(response.data.msg || 'Failed to get token prices');
                        }
                        data = response.data.data;
                        return [4 /*yield*/, this.cacheManager.set(cacheKey, data, 30 * 1000)];
                    case 4:
                        _a.sent(); // 30 seconds for prices
                        this.logger.log('Retrieved Raydium token prices', {
                            count: Object.keys(data).length,
                            mints: mintAddresses.slice(0, 3)
                        });
                        return [2 /*return*/, data];
                    case 5:
                        error_3 = _a.sent();
                        this.logger.error('Failed to get Raydium token prices:', error_3);
                        throw error_3;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumService.prototype.getPoolsByMint = function (mint1_1, mint2_1) {
        return __awaiter(this, arguments, void 0, function (mint1, mint2, poolType, pageSize) {
            var cacheKey, cached, response, data, error_4;
            if (poolType === void 0) { poolType = 'all'; }
            if (pageSize === void 0) { pageSize = 100; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = "pools_".concat(mint1, "_").concat(mint2 || 'none', "_").concat(poolType);
                        return [4 /*yield*/, this.cacheManager.get(cacheKey)];
                    case 1:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.get("".concat(this.baseURL, "/pools/info/mint"), {
                                params: {
                                    mint1: mint1,
                                    mint2: mint2,
                                    poolType: poolType,
                                    poolSortField: 'liquidity',
                                    sortType: 'desc',
                                    pageSize: pageSize,
                                    page: 1
                                }
                            }))];
                    case 3:
                        response = _a.sent();
                        if (!response.data.success) {
                            throw new Error(response.data.msg || 'Failed to get pools info');
                        }
                        data = response.data.data;
                        return [4 /*yield*/, this.cacheManager.set(cacheKey, data, 2 * 60 * 1000)];
                    case 4:
                        _a.sent(); // 2 minutes
                        this.logger.log('Retrieved Raydium pools info', {
                            count: data.length,
                            mint1: mint1,
                            mint2: mint2,
                            poolType: poolType
                        });
                        return [2 /*return*/, data];
                    case 5:
                        error_4 = _a.sent();
                        this.logger.error('Failed to get Raydium pools info:', error_4);
                        throw error_4;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumService.prototype.getPoolsInfo = function (poolIds) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, response, data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = "pools_info_".concat(poolIds.join('_'));
                        return [4 /*yield*/, this.cacheManager.get(cacheKey)];
                    case 1:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.get("".concat(this.baseURL, "/pools/info/ids"), {
                                params: { ids: poolIds.join(',') }
                            }))];
                    case 3:
                        response = _a.sent();
                        if (!response.data.success) {
                            throw new Error(response.data.msg || 'Failed to get pools info');
                        }
                        data = response.data.data;
                        return [4 /*yield*/, this.cacheManager.set(cacheKey, data, 2 * 60 * 1000)];
                    case 4:
                        _a.sent(); // 2 minutes
                        this.logger.log('Retrieved Raydium pools info by IDs', {
                            count: data.length,
                            poolIds: poolIds.slice(0, 3)
                        });
                        return [2 /*return*/, data];
                    case 5:
                        error_5 = _a.sent();
                        this.logger.error('Failed to get Raydium pools info by IDs:', error_5);
                        throw error_5;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumService.prototype.getPoolKeys = function (poolIds) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, response, data, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = "pool_keys_".concat(poolIds.join('_'));
                        return [4 /*yield*/, this.cacheManager.get(cacheKey)];
                    case 1:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.get("".concat(this.baseURL, "/pools/key/ids"), {
                                params: { ids: poolIds.join(',') }
                            }))];
                    case 3:
                        response = _a.sent();
                        if (!response.data.success) {
                            throw new Error(response.data.msg || 'Failed to get pool keys');
                        }
                        data = response.data.data;
                        return [4 /*yield*/, this.cacheManager.set(cacheKey, data, 10 * 60 * 1000)];
                    case 4:
                        _a.sent(); // 10 minutes
                        this.logger.log('Retrieved Raydium pool keys', {
                            count: data.length,
                            poolIds: poolIds.slice(0, 3)
                        });
                        return [2 /*return*/, data];
                    case 5:
                        error_6 = _a.sent();
                        this.logger.error('Failed to get Raydium pool keys:', error_6);
                        throw error_6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumService.prototype.getPoolLiquidityHistory = function (poolId) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, response, data, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = "liquidity_history_".concat(poolId);
                        return [4 /*yield*/, this.cacheManager.get(cacheKey)];
                    case 1:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.get("".concat(this.baseURL, "/pools/line/liquidity"), {
                                params: { id: poolId }
                            }))];
                    case 3:
                        response = _a.sent();
                        if (!response.data.success) {
                            throw new Error(response.data.msg || 'Failed to get liquidity history');
                        }
                        data = response.data.data;
                        return [4 /*yield*/, this.cacheManager.set(cacheKey, data, 5 * 60 * 1000)];
                    case 4:
                        _a.sent(); // 5 minutes
                        this.logger.log('Retrieved Raydium liquidity history', {
                            poolId: poolId,
                            count: data.count
                        });
                        return [2 /*return*/, data];
                    case 5:
                        error_7 = _a.sent();
                        this.logger.error('Failed to get Raydium liquidity history:', error_7);
                        throw error_7;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumService.prototype.getDefaultMintList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cached, response, data, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = 'default_mint_list';
                        return [4 /*yield*/, this.cacheManager.get(cacheKey)];
                    case 1:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.get("".concat(this.baseURL, "/mint/list")))];
                    case 3:
                        response = _a.sent();
                        if (!response.data.success) {
                            throw new Error(response.data.msg || 'Failed to get mint list');
                        }
                        data = response.data.data;
                        return [4 /*yield*/, this.cacheManager.set(cacheKey, data, 60 * 60 * 1000)];
                    case 4:
                        _a.sent(); // 1 hour
                        this.logger.log('Retrieved Raydium default mint list', {
                            mintCount: data.mintList.length,
                            blockListCount: data.blockList.length
                        });
                        return [2 /*return*/, data];
                    case 5:
                        error_8 = _a.sent();
                        this.logger.error('Failed to get Raydium mint list:', error_8);
                        throw error_8;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumService.prototype.findBestPool = function (mintA, mintB) {
        return __awaiter(this, void 0, void 0, function () {
            var pools, bestPool, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getPoolsByMint(mintA, mintB, 'all')];
                    case 1:
                        pools = _a.sent();
                        if (pools.length === 0) {
                            return [2 /*return*/, null];
                        }
                        pools.sort(function (a, b) { return b.liquidity - a.liquidity; });
                        bestPool = pools[0];
                        this.logger.log('Found best Raydium pool', {
                            poolId: bestPool.id,
                            liquidity: bestPool.liquidity,
                            volume24h: bestPool.volume24h,
                            type: bestPool.type
                        });
                        return [2 /*return*/, bestPool];
                    case 2:
                        error_9 = _a.sent();
                        this.logger.error('Failed to find best Raydium pool:', error_9);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumService.prototype.getTokenAnalysis = function (mintAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, mintInfos, prices, pools, mintInfo, price, validPools, totalLiquidity, totalVolume24h, error_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                this.getMintInfo([mintAddress]).catch(function () { return []; }),
                                this.getTokenPrices([mintAddress]).catch(function () { return ({}); }),
                                this.getPoolsByMint(mintAddress).catch(function () { return []; })
                            ])];
                    case 1:
                        _a = _b.sent(), mintInfos = _a[0], prices = _a[1], pools = _a[2];
                        mintInfo = mintInfos.length > 0 ? mintInfos[0] : null;
                        price = prices[mintAddress] || null;
                        if (pools.some(function (pool) { return typeof pool.liquidity !== 'number' || typeof pool.volume24h !== 'number'; })) {
                            this.logger.warn('Invalid pool data structure', { mintAddress: mintAddress });
                        }
                        validPools = pools.filter(function (pool) {
                            return typeof pool.liquidity === 'number' &&
                                typeof pool.volume24h === 'number';
                        });
                        totalLiquidity = validPools.reduce(function (sum, pool) { return sum + pool.liquidity; }, 0);
                        totalVolume24h = validPools.reduce(function (sum, pool) { return sum + pool.volume24h; }, 0);
                        this.logger.log('Retrieved Raydium token analysis', {
                            mintAddress: mintAddress,
                            hasInfo: !!mintInfo,
                            hasPrice: !!price,
                            poolCount: pools.length,
                            totalLiquidity: totalLiquidity,
                            totalVolume24h: totalVolume24h
                        });
                        return [2 /*return*/, {
                                mintInfo: mintInfo,
                                price: price,
                                pools: pools,
                                totalLiquidity: totalLiquidity,
                                totalVolume24h: totalVolume24h
                            }];
                    case 2:
                        error_10 = _b.sent();
                        this.logger.error('Failed to get Raydium token analysis:', error_10);
                        throw error_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumService.prototype.clearCache = function (pattern) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, keys, knownKeys, filteredKeys, error_11;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 12, , 13]);
                        if (!(typeof ((_a = this.cacheManager.stores) === null || _a === void 0 ? void 0 : _a.keys) === 'function')) return [3 /*break*/, 7];
                        if (!pattern) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.cacheManager.stores.keys("".concat(pattern, "*"))];
                    case 1:
                        keys = _b.sent();
                        return [4 /*yield*/, Promise.all(keys.map(function (key) { return _this.cacheManager.del(key); }))];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, this.cacheManager.stores.keys('*')];
                    case 4:
                        keys = _b.sent();
                        return [4 /*yield*/, Promise.all(keys.map(function (key) { return _this.cacheManager.del(key); }))];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [3 /*break*/, 11];
                    case 7:
                        this.logger.warn('Cache store does not support keys pattern matching - using fallback');
                        knownKeys = [
                            'main_info',
                            'default_mint_list',
                        ];
                        if (!pattern) return [3 /*break*/, 9];
                        filteredKeys = knownKeys.filter(function (key) { return key.includes(pattern); });
                        return [4 /*yield*/, Promise.all(filteredKeys.map(function (key) { return _this.cacheManager.del(key); }))];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, Promise.all(knownKeys.map(function (key) { return _this.cacheManager.del(key); }))];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11:
                        this.logger.log('Cache cleared successfully', { pattern: pattern });
                        return [3 /*break*/, 13];
                    case 12:
                        error_11 = _b.sent();
                        this.logger.error('Failed to clear cache:', error_11);
                        throw error_11;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    var RaydiumService_1;
    RaydiumService = RaydiumService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [axios_1.HttpService, Object])
    ], RaydiumService);
    return RaydiumService;
}());
exports.RaydiumService = RaydiumService;
