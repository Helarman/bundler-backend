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
exports.TokensService = void 0;
var common_1 = require("@nestjs/common");
var jeton_service_1 = require("../jeton/jeton.service");
var buffer_1 = require("buffer");
var TokensService = /** @class */ (function () {
    function TokensService(jetonService) {
        this.jetonService = jetonService;
        this.logger = new common_1.Logger(TokensService_1.name);
    }
    TokensService_1 = TokensService;
    TokensService.prototype.buyTokens = function (tokenBuyDto) {
        return __awaiter(this, void 0, void 0, function () {
            var result, transactions, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        this.logger.log('Token buy request received:', {
                            walletCount: (_a = tokenBuyDto.walletAddresses) === null || _a === void 0 ? void 0 : _a.length,
                            tokenAddress: tokenBuyDto.tokenAddress,
                            solAmount: tokenBuyDto.solAmount,
                            protocol: tokenBuyDto.protocol
                        });
                        // Validate required parameters
                        if (!tokenBuyDto.walletAddresses || !Array.isArray(tokenBuyDto.walletAddresses)) {
                            throw new Error('walletAddresses is required and must be an array');
                        }
                        if (!tokenBuyDto.tokenAddress) {
                            throw new Error('tokenAddress is required');
                        }
                        if (!tokenBuyDto.solAmount || tokenBuyDto.solAmount <= 0) {
                            throw new Error('solAmount is required and must be greater than 0');
                        }
                        return [4 /*yield*/, this.jetonService.buyTokens(tokenBuyDto.walletAddresses, {
                                tokenAddress: tokenBuyDto.tokenAddress,
                                solAmount: tokenBuyDto.solAmount,
                                protocol: tokenBuyDto.protocol,
                            }, tokenBuyDto.amounts)];
                    case 1:
                        result = _b.sent();
                        if (result.success && result.result) {
                            transactions = result.result.flat().map(function () {
                                return buffer_1.Buffer.from("transaction_".concat(Date.now(), "_").concat(Math.random())).toString('base64');
                            });
                            return [2 /*return*/, {
                                    success: true,
                                    transactions: transactions,
                                    bundles: result.result.map(function (bundleResults) { return ({
                                        transactions: bundleResults.map(function () {
                                            return buffer_1.Buffer.from("bundle_tx_".concat(Date.now(), "_").concat(Math.random())).toString('base64');
                                        })
                                    }); }),
                                    message: "Prepared ".concat(transactions.length, " buy transactions for ").concat(tokenBuyDto.protocol || 'jupiter')
                                }];
                        }
                        else {
                            throw new Error(result.error || 'Failed to execute token buy');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        this.logger.error('Token buy error:', error_1);
                        return [2 /*return*/, {
                                success: false,
                                error: error_1 instanceof Error ? error_1.message : 'Internal server error'
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TokensService.prototype.sellTokens = function (tokenSellDto) {
        return __awaiter(this, void 0, void 0, function () {
            var sellConfig, result, transactions, error_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        this.logger.log('Token sell request received:', {
                            walletCount: (_a = tokenSellDto.walletAddresses) === null || _a === void 0 ? void 0 : _a.length,
                            tokenAddress: tokenSellDto.tokenAddress,
                            percentage: tokenSellDto.percentage,
                            protocol: tokenSellDto.protocol
                        });
                        // Валидация
                        if (!tokenSellDto.walletAddresses || !Array.isArray(tokenSellDto.walletAddresses)) {
                            throw new Error('walletAddresses is required and must be an array');
                        }
                        if (!tokenSellDto.tokenAddress)
                            throw new Error('tokenAddress is required');
                        if (!tokenSellDto.percentage || tokenSellDto.percentage <= 0 || tokenSellDto.percentage > 100) {
                            throw new Error('percentage must be between 1 and 100');
                        }
                        sellConfig = {
                            tokenAddress: tokenSellDto.tokenAddress,
                            protocol: tokenSellDto.protocol,
                            sellPercent: (_b = tokenSellDto.sellPercent) !== null && _b !== void 0 ? _b : tokenSellDto.percentage, // используем sellPercent если есть
                            percentage: tokenSellDto.percentage,
                            slippageBps: tokenSellDto.slippageBps,
                            jitoTipLamports: tokenSellDto.jitoTipLamports
                        };
                        return [4 /*yield*/, this.jetonService.sellTokens(tokenSellDto.walletAddresses, sellConfig, tokenSellDto.customPercentages // передаем кастомные проценты
                            )];
                    case 1:
                        result = _c.sent();
                        // Обработка результата
                        if (result.success && result.result) {
                            transactions = result.result.flat().map(function () {
                                return buffer_1.Buffer.from("sell_transaction_".concat(Date.now(), "_").concat(Math.random())).toString('base64');
                            });
                            return [2 /*return*/, {
                                    success: true,
                                    transactions: transactions,
                                    bundles: result.result.map(function (bundleResults) { return ({
                                        transactions: bundleResults.map(function () {
                                            return buffer_1.Buffer.from("sell_bundle_tx_".concat(Date.now(), "_").concat(Math.random())).toString('base64');
                                        })
                                    }); }),
                                    message: "Prepared ".concat(transactions.length, " sell transactions")
                                }];
                        }
                        else {
                            throw new Error(result.error || 'Failed to execute token sell');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _c.sent();
                        this.logger.error('Token sell error:', error_2);
                        return [2 /*return*/, {
                                success: false,
                                error: error_2 instanceof Error ? error_2.message : 'Internal server error'
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TokensService.prototype.transferTokens = function (transferDto) {
        return __awaiter(this, void 0, void 0, function () {
            var result, transaction, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log('Token transfer request received:', {
                            receiver: transferDto.receiver,
                            tokenAddress: transferDto.tokenAddress,
                            amount: transferDto.amount
                        });
                        // Validate required parameters
                        if (!transferDto.senderPrivateKey || !transferDto.receiver || !transferDto.amount) {
                            throw new Error('senderPrivateKey, receiver, and amount are required');
                        }
                        return [4 /*yield*/, this.jetonService.transferTokens(transferDto.senderPrivateKey, transferDto.receiver, transferDto.tokenAddress || '', transferDto.amount)];
                    case 1:
                        result = _a.sent();
                        if (result.success && result.result) {
                            transaction = buffer_1.Buffer.from("transfer_transaction_".concat(Date.now())).toString('base64');
                            return [2 /*return*/, {
                                    success: true,
                                    data: {
                                        transaction: transaction,
                                        signature: "transfer_signature_".concat(Date.now())
                                    },
                                    message: 'Transfer transaction prepared'
                                }];
                        }
                        else {
                            throw new Error(result.error || 'Failed to execute transfer');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        this.logger.error('Transfer error:', error_3);
                        return [2 /*return*/, {
                                success: false,
                                error: error_3 instanceof Error ? error_3.message : 'Internal server error'
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TokensService.prototype.burnToken = function (burnDto) {
        return __awaiter(this, void 0, void 0, function () {
            var result, transaction, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log('Token burn request received:', {
                            tokenAddress: burnDto.tokenAddress,
                            amount: burnDto.amount
                        });
                        // Validate required parameters
                        if (!burnDto.walletPrivateKey || !burnDto.tokenAddress || !burnDto.amount) {
                            throw new Error('walletPrivateKey, tokenAddress, and amount are required');
                        }
                        return [4 /*yield*/, this.jetonService.burnToken(burnDto.walletPrivateKey, burnDto.tokenAddress, burnDto.amount)];
                    case 1:
                        result = _a.sent();
                        if (result.success && result.result) {
                            transaction = buffer_1.Buffer.from("burn_transaction_".concat(Date.now())).toString('base64');
                            return [2 /*return*/, {
                                    success: true,
                                    data: {
                                        transaction: transaction
                                    },
                                    message: 'Token burn transaction prepared'
                                }];
                        }
                        else {
                            throw new Error(result.error || 'Failed to execute burn');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        this.logger.error('Burn error:', error_4);
                        return [2 /*return*/, {
                                success: false,
                                error: error_4 instanceof Error ? error_4.message : 'Internal server error'
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TokensService.prototype.cleaner = function (cleanerDto) {
        return __awaiter(this, void 0, void 0, function () {
            var transactions;
            return __generator(this, function (_a) {
                try {
                    this.logger.log('Token cleaner request received:', {
                        sellerAddress: cleanerDto.sellerAddress,
                        buyerAddress: cleanerDto.buyerAddress,
                        tokenAddress: cleanerDto.tokenAddress,
                        sellPercentage: cleanerDto.sellPercentage,
                        buyPercentage: cleanerDto.buyPercentage
                    });
                    // Validate required parameters
                    if (!cleanerDto.sellerAddress || !cleanerDto.buyerAddress ||
                        !cleanerDto.tokenAddress || !cleanerDto.sellPercentage || !cleanerDto.buyPercentage) {
                        throw new Error('All parameters are required: sellerAddress, buyerAddress, tokenAddress, sellPercentage, buyPercentage');
                    }
                    transactions = [
                        buffer_1.Buffer.from("cleaner_sell_".concat(Date.now(), "_").concat(Math.random())).toString('base64'), // Sell transaction
                        buffer_1.Buffer.from("cleaner_todump_".concat(Date.now(), "_").concat(Math.random())).toString('base64'), // To dump wallet
                        buffer_1.Buffer.from("cleaner_fromdump_".concat(Date.now(), "_").concat(Math.random())).toString('base64'), // From dump wallet  
                        buffer_1.Buffer.from("cleaner_buy_".concat(Date.now(), "_").concat(Math.random())).toString('base64') // Buy transaction
                    ];
                    return [2 /*return*/, {
                            success: true,
                            transactions: transactions,
                            message: 'Cleaner transactions prepared (4 transactions: sell, to-dump, from-dump, buy)'
                        }];
                }
                catch (error) {
                    this.logger.error('Cleaner error:', error);
                    return [2 /*return*/, {
                            success: false,
                            error: error instanceof Error ? error.message : 'Internal server error'
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    TokensService.prototype.getTokenInfo = function (tokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    this.logger.log('Token info request received:', {
                        tokenAddress: tokenAddress
                    });
                    // Validate required parameters
                    if (!tokenAddress) {
                        throw new Error('tokenAddress is required');
                    }
                    // Mock token info for now
                    return [2 /*return*/, {
                            address: tokenAddress,
                            name: "Token ".concat(tokenAddress.slice(0, 8)),
                            symbol: "TKN".concat(tokenAddress.slice(0, 4)),
                            decimals: 6,
                            totalSupply: 1000000000,
                            description: "Token at address ".concat(tokenAddress),
                            image: null,
                            website: null,
                            twitter: null,
                            telegram: null
                        }];
                }
                catch (error) {
                    this.logger.error('Token info error:', error);
                    throw error;
                }
                return [2 /*return*/];
            });
        });
    };
    var TokensService_1;
    TokensService = TokensService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [jeton_service_1.JetonService])
    ], TokensService);
    return TokensService;
}());
exports.TokensService = TokensService;
