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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaydiumSdkService = void 0;
var common_1 = require("@nestjs/common");
var services_1 = require("@nestjs/common/services");
var raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
var web3_js_1 = require("@solana/web3.js");
var spl_token_1 = require("@solana/spl-token");
var bn_js_1 = require("bn.js");
var decimal_js_1 = __importDefault(require("decimal.js"));
var RaydiumSdkService = /** @class */ (function () {
    function RaydiumSdkService() {
        this.logger = new services_1.Logger(RaydiumSdkService_1.name);
        this.raydium = null;
        this.poolDataCache = null;
        this.cacheExpiry = null;
        this.connection = new web3_js_1.Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com', 'confirmed');
        this.cluster = process.env.NODE_ENV === 'development' ? 'devnet' : 'mainnet';
        this.logger.log("Raydium SDK Service initialized - Cluster: ".concat(this.cluster, ", RPC: ").concat(this.connection.rpcEndpoint));
    }
    RaydiumSdkService_1 = RaydiumSdkService;
    RaydiumSdkService.prototype.onModuleInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dummyKeypair;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dummyKeypair = web3_js_1.Keypair.generate();
                        return [4 /*yield*/, this.initSDK(dummyKeypair)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkService.prototype.initSDK = function (owner) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.raydium)
                            return [2 /*return*/, this.raydium];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        this.logger.log('Initializing Raydium SDK...');
                        _a = this;
                        return [4 /*yield*/, raydium_sdk_v2_1.Raydium.load({
                                owner: owner,
                                connection: this.connection,
                                cluster: this.cluster,
                                disableFeatureCheck: true,
                                disableLoadToken: false,
                                blockhashCommitment: 'finalized'
                            })];
                    case 2:
                        _a.raydium = _b.sent();
                        return [4 /*yield*/, this.raydium.fetchChainTime()];
                    case 3:
                        _b.sent();
                        this.logger.log('Raydium SDK initialized successfully');
                        return [2 /*return*/, this.raydium];
                    case 4:
                        error_1 = _b.sent();
                        this.logger.error('Failed to initialize Raydium SDK', error_1);
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkService.prototype.getPoolData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var poolData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.poolDataCache && this.cacheExpiry && new Date() < this.cacheExpiry) {
                            return [2 /*return*/, this.poolDataCache];
                        }
                        if (!this.raydium) {
                            throw new Error('Raydium SDK not initialized');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this.logger.log('Fetching pool data...');
                        return [4 /*yield*/, this.raydium.tradeV2.fetchRoutePoolBasicInfo()];
                    case 2:
                        poolData = _a.sent();
                        this.poolDataCache = poolData;
                        this.cacheExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes cache
                        this.logger.log("Pool data fetched - AMM: ".concat(poolData.ammPools.length, ", CLMM: ").concat(poolData.clmmPools.length, ", CPMM: ").concat(poolData.cpmmPools.length));
                        return [2 /*return*/, poolData];
                    case 3:
                        error_2 = _a.sent();
                        this.logger.error('Failed to fetch pool data', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkService.prototype.routeSwap = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var owner, raydium, inputMint, outputMint, poolData, routes, _a, routePathDict, mintInfos, ammPoolsRpcInfo, ammSimulateCache_1, clmmPoolsRpcInfo, computeClmmPoolInfo_1, computePoolTickData, computeCpmmData_1, swapRoutes, _b, _c, targetRoute, poolKeys, execute, txIds, result, error_3;
            var _d;
            var _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 8, , 9]);
                        owner = web3_js_1.Keypair.fromSecretKey(Buffer.from(params.walletPrivateKey, 'base64'));
                        return [4 /*yield*/, this.initSDK(owner)];
                    case 1:
                        raydium = _g.sent();
                        this.logger.log("Route swap request - Input: ".concat(params.inputMint, ", Output: ").concat(params.outputMint, ", Amount: ").concat(params.inputAmount));
                        inputMint = new web3_js_1.PublicKey(params.inputMint);
                        outputMint = new web3_js_1.PublicKey(params.outputMint);
                        return [4 /*yield*/, this.getPoolData()];
                    case 2:
                        poolData = _g.sent();
                        routes = raydium.tradeV2.getAllRoute(__assign({ inputMint: inputMint, outputMint: outputMint }, poolData));
                        if (routes.directPath.length === 0 && Object.keys(routes.routePathDict).length === 0) {
                            throw new Error('No swap routes found for this token pair');
                        }
                        return [4 /*yield*/, raydium.tradeV2.fetchSwapRoutesData({
                                routes: routes,
                                inputMint: inputMint,
                                outputMint: outputMint,
                            })];
                    case 3:
                        _a = _g.sent(), routePathDict = _a.routePathDict, mintInfos = _a.mintInfos, ammPoolsRpcInfo = _a.ammPoolsRpcInfo, ammSimulateCache_1 = _a.ammSimulateCache, clmmPoolsRpcInfo = _a.clmmPoolsRpcInfo, computeClmmPoolInfo_1 = _a.computeClmmPoolInfo, computePoolTickData = _a.computePoolTickData, computeCpmmData_1 = _a.computeCpmmData;
                        _c = (_b = raydium.tradeV2).getAllRouteComputeAmountOut;
                        _d = {
                            inputTokenAmount: new raydium_sdk_v2_1.TokenAmount(new raydium_sdk_v2_1.Token({
                                mint: params.inputMint,
                                decimals: mintInfos[params.inputMint].decimals,
                                isToken2022: mintInfos[params.inputMint].programId.equals(spl_token_1.TOKEN_2022_PROGRAM_ID),
                            }), params.inputAmount),
                            directPath: routes.directPath.map(function (p) { return ammSimulateCache_1[p.id.toBase58()] ||
                                computeClmmPoolInfo_1[p.id.toBase58()] ||
                                computeCpmmData_1[p.id.toBase58()]; }),
                            routePathDict: routePathDict,
                            simulateCache: ammSimulateCache_1,
                            tickCache: computePoolTickData,
                            mintInfos: mintInfos,
                            outputToken: (0, raydium_sdk_v2_1.toApiV3Token)(__assign(__assign({}, mintInfos[params.outputMint]), { programId: mintInfos[params.outputMint].programId.toBase58(), address: params.outputMint, freezeAuthority: undefined, mintAuthority: undefined, extensions: {
                                    feeConfig: (0, raydium_sdk_v2_1.toFeeConfig)(mintInfos[params.outputMint].feeConfig),
                                } })),
                            chainTime: Math.floor((_f = (_e = raydium.chainTimeData) === null || _e === void 0 ? void 0 : _e.chainTime) !== null && _f !== void 0 ? _f : Date.now() / 1000),
                            slippage: params.slippage
                        };
                        return [4 /*yield*/, raydium.connection.getEpochInfo()];
                    case 4:
                        swapRoutes = _c.apply(_b, [(_d.epochInfo = _g.sent(),
                                _d)]);
                        targetRoute = swapRoutes[0];
                        if (!targetRoute) {
                            throw new Error('No profitable swap routes found');
                        }
                        this.logger.log("Best route found - Input: ".concat(targetRoute.amountIn.amount.toExact(), ", Output: ").concat(targetRoute.amountOut.amount.toExact()));
                        return [4 /*yield*/, raydium.tradeV2.computePoolToPoolKeys({
                                pools: targetRoute.poolInfoList,
                                ammRpcData: ammPoolsRpcInfo,
                                clmmRpcData: clmmPoolsRpcInfo,
                            })];
                    case 5:
                        poolKeys = _g.sent();
                        return [4 /*yield*/, raydium.tradeV2.swap({
                                routeProgram: raydium_sdk_v2_1.Router,
                                txVersion: raydium_sdk_v2_1.TxVersion.V0,
                                swapInfo: targetRoute,
                                swapPoolKeys: poolKeys,
                                ownerInfo: {
                                    associatedOnly: true,
                                    checkCreateATAOwner: true,
                                },
                                computeBudgetConfig: {
                                    units: 600000,
                                    microLamports: 465915,
                                },
                            })];
                    case 6:
                        execute = (_g.sent()).execute;
                        return [4 /*yield*/, execute({ sequentially: true })];
                    case 7:
                        txIds = (_g.sent()).txIds;
                        result = {
                            txId: txIds[0],
                            inputAmount: targetRoute.amountIn.amount.toExact(),
                            outputAmount: targetRoute.amountOut.amount.toExact(),
                            minOutputAmount: targetRoute.minAmountOut.amount.toExact(),
                            route: targetRoute.poolInfoList.map(function (p) { return typeof p.id === 'string' ? p.id : p.id.toBase58(); })
                        };
                        this.logger.log('Route swap completed');
                        return [2 /*return*/, result];
                    case 8:
                        error_3 = _g.sent();
                        this.logger.error('Route swap failed', error_3);
                        throw error_3;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkService.prototype.cpmmSwap = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var owner, raydium, poolInfo, poolKeys, rpcData, data, data, inputAmount, baseIn, swapResult, execute, txId, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        owner = web3_js_1.Keypair.fromSecretKey(Buffer.from(params.walletPrivateKey, 'base64'));
                        return [4 /*yield*/, this.initSDK(owner)];
                    case 1:
                        raydium = _a.sent();
                        this.logger.log("CPMM swap request - Pool: ".concat(params.poolId, ", Input: ").concat(params.inputMint, ", Amount: ").concat(params.inputAmount));
                        poolInfo = void 0;
                        poolKeys = void 0;
                        rpcData = void 0;
                        if (!(this.cluster === 'mainnet')) return [3 /*break*/, 4];
                        return [4 /*yield*/, raydium.api.fetchPoolById({ ids: params.poolId })];
                    case 2:
                        data = _a.sent();
                        poolInfo = data[0];
                        return [4 /*yield*/, raydium.cpmm.getRpcPoolInfo(poolInfo.id, true)];
                    case 3:
                        rpcData = _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, raydium.cpmm.getPoolInfoFromRpc(params.poolId)];
                    case 5:
                        data = _a.sent();
                        poolInfo = data.poolInfo;
                        poolKeys = data.poolKeys;
                        rpcData = data.rpcData;
                        _a.label = 6;
                    case 6:
                        inputAmount = new bn_js_1.BN(params.inputAmount);
                        baseIn = params.inputMint === poolInfo.mintA.address;
                        swapResult = raydium_sdk_v2_1.CurveCalculator.swap(inputAmount, baseIn ? rpcData.baseReserve : rpcData.quoteReserve, baseIn ? rpcData.quoteReserve : rpcData.baseReserve, rpcData.configInfo.tradeFeeRate);
                        return [4 /*yield*/, raydium.cpmm.swap({
                                poolInfo: poolInfo,
                                poolKeys: poolKeys,
                                inputAmount: inputAmount,
                                swapResult: swapResult,
                                slippage: params.slippage,
                                baseIn: baseIn,
                                computeBudgetConfig: {
                                    units: 600000,
                                    microLamports: 465915,
                                },
                            })];
                    case 7:
                        execute = (_a.sent()).execute;
                        return [4 /*yield*/, execute({ sendAndConfirm: true })];
                    case 8:
                        txId = (_a.sent()).txId;
                        result = {
                            txId: txId,
                            inputAmount: swapResult.sourceAmountSwapped.toString(),
                            outputAmount: swapResult.destinationAmountSwapped.toString(),
                            minOutputAmount: swapResult.destinationAmountSwapped.toString(),
                            route: [params.poolId]
                        };
                        this.logger.log('CPMM swap completed');
                        return [2 /*return*/, result];
                    case 9:
                        error_4 = _a.sent();
                        this.logger.error('CPMM swap failed', error_4);
                        throw error_4;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkService.prototype.clmmSwap = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var owner, raydium, poolInfo, poolKeys, clmmPoolInfo, tickCache, data, data, inputAmount, baseIn, _a, minAmountOut, remainingAccounts, _b, _c, execute, txId, result, error_5;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 12, , 13]);
                        owner = web3_js_1.Keypair.fromSecretKey(Buffer.from(params.walletPrivateKey, 'base64'));
                        return [4 /*yield*/, this.initSDK(owner)];
                    case 1:
                        raydium = _e.sent();
                        this.logger.log("CLMM swap request - Pool: ".concat(params.poolId, ", Input: ").concat(params.inputMint, ", Amount: ").concat(params.inputAmount));
                        poolInfo = void 0;
                        poolKeys = void 0;
                        clmmPoolInfo = void 0;
                        tickCache = void 0;
                        if (!(this.cluster === 'mainnet')) return [3 /*break*/, 5];
                        return [4 /*yield*/, raydium.api.fetchPoolById({ ids: params.poolId })];
                    case 2:
                        data = _e.sent();
                        poolInfo = data[0];
                        return [4 /*yield*/, raydium_sdk_v2_1.PoolUtils.fetchComputeClmmInfo({
                                connection: raydium.connection,
                                poolInfo: poolInfo,
                            })];
                    case 3:
                        clmmPoolInfo = _e.sent();
                        return [4 /*yield*/, raydium_sdk_v2_1.PoolUtils.fetchMultiplePoolTickArrays({
                                connection: raydium.connection,
                                poolKeys: [clmmPoolInfo],
                            })];
                    case 4:
                        tickCache = _e.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, raydium.clmm.getPoolInfoFromRpc(params.poolId)];
                    case 6:
                        data = _e.sent();
                        poolInfo = data.poolInfo;
                        poolKeys = data.poolKeys;
                        clmmPoolInfo = data.computePoolInfo;
                        tickCache = data.tickData;
                        _e.label = 7;
                    case 7:
                        inputAmount = new bn_js_1.BN(params.inputAmount);
                        baseIn = params.inputMint === poolInfo.mintA.address;
                        _c = (_b = raydium_sdk_v2_1.PoolUtils).computeAmountOutFormat;
                        _d = {
                            poolInfo: clmmPoolInfo,
                            tickArrayCache: tickCache[params.poolId],
                            amountIn: inputAmount,
                            tokenOut: poolInfo[baseIn ? 'mintB' : 'mintA'],
                            slippage: params.slippage
                        };
                        return [4 /*yield*/, raydium.fetchEpochInfo()];
                    case 8: return [4 /*yield*/, _c.apply(_b, [(_d.epochInfo = _e.sent(),
                                _d)])];
                    case 9:
                        _a = _e.sent(), minAmountOut = _a.minAmountOut, remainingAccounts = _a.remainingAccounts;
                        return [4 /*yield*/, raydium.clmm.swap({
                                poolInfo: poolInfo,
                                poolKeys: poolKeys,
                                inputMint: poolInfo[baseIn ? 'mintA' : 'mintB'].address,
                                amountIn: inputAmount,
                                amountOutMin: minAmountOut.amount.raw,
                                observationId: clmmPoolInfo.observationId,
                                ownerInfo: {
                                    useSOLBalance: true,
                                },
                                remainingAccounts: remainingAccounts,
                                txVersion: raydium_sdk_v2_1.TxVersion.V0,
                                computeBudgetConfig: {
                                    units: 600000,
                                    microLamports: 465915,
                                },
                            })];
                    case 10:
                        execute = (_e.sent()).execute;
                        return [4 /*yield*/, execute()];
                    case 11:
                        txId = (_e.sent()).txId;
                        result = {
                            txId: txId,
                            inputAmount: inputAmount.toString(),
                            outputAmount: minAmountOut.amount.toExact(),
                            minOutputAmount: minAmountOut.amount.toExact(),
                            route: [params.poolId]
                        };
                        this.logger.log('CLMM swap completed');
                        return [2 /*return*/, result];
                    case 12:
                        error_5 = _e.sent();
                        this.logger.error('CLMM swap failed', error_5);
                        throw error_5;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkService.prototype.getPoolsForPair = function (mintA, mintB) {
        return __awaiter(this, void 0, void 0, function () {
            var poolData, pools, _i, _a, pool, _b, _c, pool, _d, _e, pool, error_6;
            var _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _j.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getPoolData()];
                    case 1:
                        poolData = _j.sent();
                        pools = [];
                        // Check CPMM pools
                        for (_i = 0, _a = poolData.cpmmPools; _i < _a.length; _i++) {
                            pool = _a[_i];
                            if ((pool.mintA.address === mintA && pool.mintB.address === mintB) ||
                                (pool.mintA.address === mintB && pool.mintB.address === mintA)) {
                                pools.push({
                                    id: pool.id,
                                    type: 'CPMM',
                                    mintA: pool.mintA.address,
                                    mintB: pool.mintB.address,
                                    liquidity: ((_f = pool.tvl) === null || _f === void 0 ? void 0 : _f.toString()) || '0',
                                    price: pool.price || 0
                                });
                            }
                        }
                        // Check CLMM pools
                        for (_b = 0, _c = poolData.clmmPools; _b < _c.length; _b++) {
                            pool = _c[_b];
                            if ((pool.mintA.address === mintA && pool.mintB.address === mintB) ||
                                (pool.mintA.address === mintB && pool.mintB.address === mintA)) {
                                pools.push({
                                    id: pool.id,
                                    type: 'CLMM',
                                    mintA: pool.mintA.address,
                                    mintB: pool.mintB.address,
                                    liquidity: ((_g = pool.tvl) === null || _g === void 0 ? void 0 : _g.toString()) || '0',
                                    price: pool.price || 0
                                });
                            }
                        }
                        // Check AMM pools
                        for (_d = 0, _e = poolData.ammPools; _d < _e.length; _d++) {
                            pool = _e[_d];
                            if ((pool.mintA.address === mintA && pool.mintB.address === mintB) ||
                                (pool.mintA.address === mintB && pool.mintB.address === mintA)) {
                                pools.push({
                                    id: pool.id,
                                    type: 'AMM',
                                    mintA: pool.mintA.address,
                                    mintB: pool.mintB.address,
                                    liquidity: ((_h = pool.tvl) === null || _h === void 0 ? void 0 : _h.toString()) || '0',
                                    price: pool.price || 0
                                });
                            }
                        }
                        this.logger.log("Found ".concat(pools.length, " pools for pair ").concat(mintA, "/").concat(mintB));
                        return [2 /*return*/, pools];
                    case 2:
                        error_6 = _j.sent();
                        this.logger.error('Failed to get pools for pair', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkService.prototype.clearCache = function () {
        this.poolDataCache = null;
        this.cacheExpiry = null;
        this.raydium = null;
        this.logger.log('Raydium SDK cache cleared');
    };
    RaydiumSdkService.prototype.createCpmmPool = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var owner, raydium, mintA, mintB, feeConfigs, selectedFeeConfig, _a, execute, extInfo_1, txId, poolKeys, result, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        owner = web3_js_1.Keypair.fromSecretKey(Buffer.from(params.walletPrivateKey, 'base64'));
                        return [4 /*yield*/, this.initSDK(owner)];
                    case 1:
                        raydium = _b.sent();
                        this.logger.log("Creating CPMM pool - Mints: ".concat(params.mintA, "/").concat(params.mintB, ", Amounts: ").concat(params.mintAAmount, "/").concat(params.mintBAmount));
                        return [4 /*yield*/, raydium.token.getTokenInfo(params.mintA)];
                    case 2:
                        mintA = _b.sent();
                        return [4 /*yield*/, raydium.token.getTokenInfo(params.mintB)];
                    case 3:
                        mintB = _b.sent();
                        return [4 /*yield*/, raydium.api.getCpmmConfigs()];
                    case 4:
                        feeConfigs = _b.sent();
                        if (this.cluster === 'devnet') {
                            feeConfigs.forEach(function (config) {
                                config.id = (0, raydium_sdk_v2_1.getCpmmPdaAmmConfigId)(raydium_sdk_v2_1.DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM, config.index).publicKey.toBase58();
                            });
                        }
                        selectedFeeConfig = feeConfigs[params.feeConfigIndex || 0];
                        if (!selectedFeeConfig) {
                            throw new Error('Invalid fee config index');
                        }
                        return [4 /*yield*/, raydium.cpmm.createPool({
                                programId: this.cluster === 'devnet' ? raydium_sdk_v2_1.DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM : raydium_sdk_v2_1.CREATE_CPMM_POOL_PROGRAM,
                                poolFeeAccount: this.cluster === 'devnet' ? raydium_sdk_v2_1.DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_FEE_ACC : raydium_sdk_v2_1.CREATE_CPMM_POOL_FEE_ACC,
                                mintA: mintA,
                                mintB: mintB,
                                mintAAmount: new bn_js_1.BN(params.mintAAmount),
                                mintBAmount: new bn_js_1.BN(params.mintBAmount),
                                startTime: new bn_js_1.BN(params.startTime || 0),
                                feeConfig: selectedFeeConfig,
                                associatedOnly: false,
                                ownerInfo: {
                                    useSOLBalance: true,
                                },
                                txVersion: raydium_sdk_v2_1.TxVersion.V0,
                                computeBudgetConfig: {
                                    units: 600000,
                                    microLamports: 46591500,
                                },
                            })];
                    case 5:
                        _a = _b.sent(), execute = _a.execute, extInfo_1 = _a.extInfo;
                        return [4 /*yield*/, execute({ sendAndConfirm: true })];
                    case 6:
                        txId = (_b.sent()).txId;
                        poolKeys = Object.keys(extInfo_1.address).reduce(function (acc, cur) {
                            var _a;
                            return (__assign(__assign({}, acc), (_a = {}, _a[cur] = extInfo_1.address[cur].toString(), _a)));
                        }, {});
                        result = {
                            txId: txId,
                            poolId: poolKeys.id || '',
                            poolKeys: poolKeys
                        };
                        this.logger.log('CPMM pool created successfully');
                        return [2 /*return*/, result];
                    case 7:
                        error_7 = _b.sent();
                        this.logger.error('Failed to create CPMM pool', error_7);
                        throw error_7;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkService.prototype.createClmmPool = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var owner, raydium, mint1, mint2, clmmConfigs, selectedConfig, _a, execute, extInfo_2, txId, poolKeys, result, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        owner = web3_js_1.Keypair.fromSecretKey(Buffer.from(params.walletPrivateKey, 'base64'));
                        return [4 /*yield*/, this.initSDK(owner)];
                    case 1:
                        raydium = _b.sent();
                        this.logger.log("Creating CLMM pool - Mints: ".concat(params.mintA, "/").concat(params.mintB, ", Initial price: ").concat(params.initialPrice));
                        return [4 /*yield*/, raydium.token.getTokenInfo(params.mintA)];
                    case 2:
                        mint1 = _b.sent();
                        return [4 /*yield*/, raydium.token.getTokenInfo(params.mintB)];
                    case 3:
                        mint2 = _b.sent();
                        return [4 /*yield*/, raydium.api.getClmmConfigs()];
                    case 4:
                        clmmConfigs = _b.sent();
                        selectedConfig = clmmConfigs[params.configIndex || 0];
                        if (!selectedConfig) {
                            throw new Error('Invalid config index');
                        }
                        return [4 /*yield*/, raydium.clmm.createPool({
                                programId: this.cluster === 'devnet' ? raydium_sdk_v2_1.DEVNET_PROGRAM_ID.CLMM_PROGRAM_ID : raydium_sdk_v2_1.CLMM_PROGRAM_ID,
                                mint1: mint1,
                                mint2: mint2,
                                ammConfig: __assign(__assign({}, selectedConfig), { id: new web3_js_1.PublicKey(selectedConfig.id), fundOwner: '', description: '' }),
                                initialPrice: new decimal_js_1.default(params.initialPrice),
                                txVersion: raydium_sdk_v2_1.TxVersion.V0,
                                computeBudgetConfig: {
                                    units: 600000,
                                    microLamports: 46591500,
                                },
                            })];
                    case 5:
                        _a = _b.sent(), execute = _a.execute, extInfo_2 = _a.extInfo;
                        return [4 /*yield*/, execute({ sendAndConfirm: true })];
                    case 6:
                        txId = (_b.sent()).txId;
                        poolKeys = (extInfo_2 === null || extInfo_2 === void 0 ? void 0 : extInfo_2.address) ? Object.keys(extInfo_2.address).reduce(function (acc, cur) {
                            var _a;
                            var _b;
                            return (__assign(__assign({}, acc), (_a = {}, _a[cur] = ((_b = extInfo_2.address[cur]) === null || _b === void 0 ? void 0 : _b.toString()) || '', _a)));
                        }, {}) : {};
                        result = {
                            txId: txId,
                            poolId: poolKeys.id || '',
                            poolKeys: poolKeys
                        };
                        this.logger.log('CLMM pool created successfully');
                        return [2 /*return*/, result];
                    case 7:
                        error_8 = _b.sent();
                        this.logger.error('Failed to create CLMM pool', error_8);
                        throw error_8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkService.prototype.createAmmPool = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var owner, raydium, marketId, marketBufferInfo, _a, baseMint, quoteMint, baseMintInfo, quoteMintInfo, baseAmount, quoteAmount, _b, execute, extInfo_3, txId, poolKeys, result, error_9;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        owner = web3_js_1.Keypair.fromSecretKey(Buffer.from(params.walletPrivateKey, 'base64'));
                        return [4 /*yield*/, this.initSDK(owner)];
                    case 1:
                        raydium = _c.sent();
                        this.logger.log("Creating AMM pool - Market: ".concat(params.marketId, ", Amounts: ").concat(params.mintAAmount, "/").concat(params.mintBAmount));
                        marketId = new web3_js_1.PublicKey(params.marketId);
                        return [4 /*yield*/, raydium.connection.getAccountInfo(marketId)];
                    case 2:
                        marketBufferInfo = _c.sent();
                        if (!marketBufferInfo) {
                            throw new Error('Market not found');
                        }
                        _a = raydium_sdk_v2_1.MARKET_STATE_LAYOUT_V3.decode(marketBufferInfo.data), baseMint = _a.baseMint, quoteMint = _a.quoteMint;
                        return [4 /*yield*/, raydium.token.getTokenInfo(baseMint)];
                    case 3:
                        baseMintInfo = _c.sent();
                        return [4 /*yield*/, raydium.token.getTokenInfo(quoteMint)];
                    case 4:
                        quoteMintInfo = _c.sent();
                        if (baseMintInfo.programId !== spl_token_1.TOKEN_PROGRAM_ID.toBase58() ||
                            quoteMintInfo.programId !== spl_token_1.TOKEN_PROGRAM_ID.toBase58()) {
                            throw new Error('AMM pools with OpenBook market only support TOKEN_PROGRAM_ID mints. For Token2022, use CPMM pool instead.');
                        }
                        baseAmount = new bn_js_1.BN(params.mintAAmount);
                        quoteAmount = new bn_js_1.BN(params.mintBAmount);
                        if (baseAmount.mul(quoteAmount).lte(new bn_js_1.BN(1).mul(new bn_js_1.BN(Math.pow(10, baseMintInfo.decimals))).pow(new bn_js_1.BN(2)))) {
                            throw new Error('Initial liquidity too low, try adding more baseAmount/quoteAmount');
                        }
                        return [4 /*yield*/, raydium.liquidity.createPoolV4({
                                programId: this.cluster === 'devnet' ? raydium_sdk_v2_1.DEVNET_PROGRAM_ID.AMM_V4 : raydium_sdk_v2_1.AMM_V4,
                                marketInfo: {
                                    marketId: marketId,
                                    programId: this.cluster === 'devnet' ? raydium_sdk_v2_1.DEVNET_PROGRAM_ID.OPEN_BOOK_PROGRAM : raydium_sdk_v2_1.OPEN_BOOK_PROGRAM,
                                },
                                baseMintInfo: {
                                    mint: baseMint,
                                    decimals: baseMintInfo.decimals,
                                },
                                quoteMintInfo: {
                                    mint: quoteMint,
                                    decimals: quoteMintInfo.decimals,
                                },
                                baseAmount: baseAmount,
                                quoteAmount: quoteAmount,
                                startTime: new bn_js_1.BN(params.startTime || 0),
                                ownerInfo: {
                                    useSOLBalance: true,
                                },
                                associatedOnly: false,
                                txVersion: raydium_sdk_v2_1.TxVersion.V0,
                                feeDestinationId: this.cluster === 'devnet' ? raydium_sdk_v2_1.DEVNET_PROGRAM_ID.FEE_DESTINATION_ID : raydium_sdk_v2_1.FEE_DESTINATION_ID,
                                computeBudgetConfig: {
                                    units: 600000,
                                    microLamports: 4659150,
                                },
                            })];
                    case 5:
                        _b = _c.sent(), execute = _b.execute, extInfo_3 = _b.extInfo;
                        return [4 /*yield*/, execute({ sendAndConfirm: true })];
                    case 6:
                        txId = (_c.sent()).txId;
                        poolKeys = Object.keys(extInfo_3.address).reduce(function (acc, cur) {
                            var _a;
                            return (__assign(__assign({}, acc), (_a = {}, _a[cur] = extInfo_3.address[cur].toBase58(), _a)));
                        }, {});
                        result = {
                            txId: txId,
                            poolId: poolKeys.id || '',
                            poolKeys: poolKeys
                        };
                        this.logger.log('AMM pool created successfully');
                        return [2 /*return*/, result];
                    case 7:
                        error_9 = _c.sent();
                        this.logger.error('Failed to create AMM pool', error_9);
                        throw error_9;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkService.prototype.getCpmmFeeConfigs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var feeConfigs, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.raydium.api.getCpmmConfigs()];
                    case 1:
                        feeConfigs = _a.sent();
                        if (this.cluster === 'devnet') {
                            feeConfigs.forEach(function (config) {
                                config.id = (0, raydium_sdk_v2_1.getCpmmPdaAmmConfigId)(raydium_sdk_v2_1.DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM, config.index).publicKey.toBase58();
                            });
                        }
                        return [2 /*return*/, feeConfigs];
                    case 2:
                        error_10 = _a.sent();
                        this.logger.error('Failed to get CPMM fee configs', error_10);
                        throw error_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSdkService.prototype.getClmmConfigs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var clmmConfigs, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.raydium.api.getClmmConfigs()];
                    case 1:
                        clmmConfigs = _a.sent();
                        return [2 /*return*/, clmmConfigs];
                    case 2:
                        error_11 = _a.sent();
                        this.logger.error('Failed to get CLMM configs', error_11);
                        throw error_11;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    var RaydiumSdkService_1;
    RaydiumSdkService = RaydiumSdkService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [])
    ], RaydiumSdkService);
    return RaydiumSdkService;
}());
exports.RaydiumSdkService = RaydiumSdkService;
