"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.JetonService = void 0;
var common_1 = require("@nestjs/common");
var web3_js_1 = require("@solana/web3.js");
var bs58 = __importStar(require("bs58"));
var sdk_1 = require("../../../sdk");
var JetonService = /** @class */ (function () {
    function JetonService() {
        this.logger = new common_1.Logger(JetonService_1.name);
        this.sdk = null;
        this.initializeSDK();
    }
    JetonService_1 = JetonService;
    JetonService.prototype.initializeSDK = function () {
        try {
            (0, sdk_1.configure)({
                apiUrl: process.env.API_URL || 'http://localhost:3000',
                baseUrl: process.env.BASE_URL || 'http://localhost:3000',
                rpcUrl: process.env.RPC_URL || 'https://api.mainnet-beta.solana.com',
                debug: process.env.NODE_ENV === 'development',
            });
            this.sdk = new sdk_1.JetonSDK({
                apiUrl: process.env.API_URL || 'http://localhost:3000',
                baseUrl: process.env.BASE_URL || 'http://localhost:3000',
                rpcUrl: process.env.RPC_URL || 'https://api.mainnet-beta.solana.com',
                debug: process.env.NODE_ENV === 'development',
            });
            this.logger.log('JetonSDK initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize JetonSDK', error);
            throw error;
        }
    };
    JetonService.prototype.createPlaceholderWalletsFromAddresses = function (addresses) {
        return addresses.map(function () {
            var keypair = web3_js_1.Keypair.generate();
            return { privateKey: bs58.encode(keypair.secretKey) };
        });
    };
    JetonService.prototype.createWalletsFromPrivateKeys = function (privateKeys) {
        var _this = this;
        return privateKeys.map(function (privateKey) {
            try {
                web3_js_1.Keypair.fromSecretKey(bs58.decode(privateKey));
                return { privateKey: privateKey };
            }
            catch (error) {
                _this.logger.warn('Invalid private key provided', error);
                throw new Error('Invalid private key format');
            }
        });
    };
    JetonService.prototype.buyTokens = function (walletAddresses, tokenConfig, customAmounts) {
        return __awaiter(this, void 0, void 0, function () {
            var wallets, result, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        this.logger.log("Buying tokens for ".concat(walletAddresses.length, " wallets"), tokenConfig);
                        wallets = this.createPlaceholderWalletsFromAddresses(walletAddresses);
                        return [4 /*yield*/, (0, sdk_1.buyTokenBatch)(wallets, tokenConfig, customAmounts)];
                    case 1:
                        result = _b.sent();
                        this.logger.log('Token buy completed', {
                            success: result.success,
                            count: (_a = result.result) === null || _a === void 0 ? void 0 : _a.length,
                        });
                        return [2 /*return*/, result];
                    case 2:
                        error_1 = _b.sent();
                        this.logger.error('Token buy failed', error_1);
                        return [2 /*return*/, {
                                success: false,
                                error: error_1 instanceof Error ? error_1.message : 'Unknown error',
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JetonService.prototype.sellTokens = function (walletAddresses, tokenConfig, customPercentages) {
        return __awaiter(this, void 0, void 0, function () {
            var wallets, result, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        this.logger.log("Selling tokens for ".concat(walletAddresses.length, " wallets"), tokenConfig);
                        wallets = this.createPlaceholderWalletsFromAddresses(walletAddresses);
                        return [4 /*yield*/, (0, sdk_1.sellTokenBatch)(wallets, tokenConfig, customPercentages)];
                    case 1:
                        result = _b.sent();
                        this.logger.log('Token sell completed', {
                            success: result.success,
                            count: (_a = result.result) === null || _a === void 0 ? void 0 : _a.length,
                        });
                        return [2 /*return*/, result];
                    case 2:
                        error_2 = _b.sent();
                        this.logger.error('Token sell failed', error_2);
                        return [2 /*return*/, {
                                success: false,
                                error: error_2 instanceof Error ? error_2.message : 'Unknown error',
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JetonService.prototype.createToken = function (walletAddresses, config, amounts) {
        return __awaiter(this, void 0, void 0, function () {
            var sdkConfig, wallets, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log("Creating token for ".concat(walletAddresses.length, " wallets"), config);
                        sdkConfig = this.adaptTokenCreateConfig(config);
                        wallets = this.createPlaceholderWalletsFromAddresses(walletAddresses);
                        return [4 /*yield*/, (0, sdk_1.createTokenSingle)(wallets, sdkConfig)];
                    case 1:
                        result = _a.sent();
                        this.logger.log('Token creation completed', {
                            success: result.success,
                        });
                        return [2 /*return*/, result];
                    case 2:
                        error_3 = _a.sent();
                        this.logger.error('Token creation failed', error_3);
                        return [2 /*return*/, {
                                success: false,
                                error: error_3 instanceof Error ? error_3.message : 'Unknown error',
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JetonService.prototype.transferTokens = function (senderPrivateKey, receiver, tokenAddress, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var senderWallet, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log('Transferring tokens', {
                            receiver: receiver,
                            tokenAddress: tokenAddress,
                            amount: amount,
                        });
                        senderWallet = { privateKey: senderPrivateKey };
                        return [4 /*yield*/, (0, sdk_1.transferTokens)(senderWallet, receiver, tokenAddress, amount)];
                    case 1:
                        result = _a.sent();
                        this.logger.log('Token transfer completed', {
                            success: result.success,
                        });
                        return [2 /*return*/, result];
                    case 2:
                        error_4 = _a.sent();
                        this.logger.error('Token transfer failed', error_4);
                        return [2 /*return*/, {
                                success: false,
                                error: error_4 instanceof Error ? error_4.message : 'Unknown error',
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JetonService.prototype.burnToken = function (walletPrivateKey, tokenAddress, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log('Burning tokens', {
                            tokenAddress: tokenAddress,
                            amount: amount,
                        });
                        wallet = { privateKey: walletPrivateKey };
                        return [4 /*yield*/, (0, sdk_1.burnToken)(wallet, tokenAddress, amount)];
                    case 1:
                        result = _a.sent();
                        this.logger.log('Token burn completed', {
                            success: result.success,
                        });
                        return [2 /*return*/, result];
                    case 2:
                        error_5 = _a.sent();
                        this.logger.error('Token burn failed', error_5);
                        return [2 /*return*/, {
                                success: false,
                                error: error_5 instanceof Error ? error_5.message : 'Unknown error',
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JetonService.prototype.distributeSOL = function (senderAddress, recipients) {
        return __awaiter(this, void 0, void 0, function () {
            var senderWallet, recipientWallets, result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log('Distributing SOL', {
                            senderAddress: senderAddress,
                            recipientCount: recipients.length,
                        });
                        senderWallet = { privateKey: '' };
                        recipientWallets = recipients.map(function (recipient) { return ({
                            privateKey: '',
                            amount: recipient.amount,
                        }); });
                        return [4 /*yield*/, (0, sdk_1.distributeSOL)(senderWallet, recipientWallets)];
                    case 1:
                        result = _a.sent();
                        this.logger.log('SOL distribution completed', {
                            success: result.success,
                        });
                        return [2 /*return*/, result];
                    case 2:
                        error_6 = _a.sent();
                        this.logger.error('SOL distribution failed', error_6);
                        return [2 /*return*/, {
                                success: false,
                                error: error_6 instanceof Error ? error_6.message : 'Unknown error',
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JetonService.prototype.consolidateSOL = function (sourceAddresses, receiverAddress, percentage) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceWallets, receiverWallet, result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log('Consolidating SOL', {
                            sourceCount: sourceAddresses.length,
                            receiverAddress: receiverAddress,
                            percentage: percentage,
                        });
                        sourceWallets = this.createPlaceholderWalletsFromAddresses(sourceAddresses);
                        receiverWallet = { privateKey: '' };
                        return [4 /*yield*/, (0, sdk_1.consolidateSOL)(sourceWallets, receiverWallet, percentage)];
                    case 1:
                        result = _a.sent();
                        this.logger.log('SOL consolidation completed', {
                            success: result.success,
                        });
                        return [2 /*return*/, result];
                    case 2:
                        error_7 = _a.sent();
                        this.logger.error('SOL consolidation failed', error_7);
                        return [2 /*return*/, {
                                success: false,
                                error: error_7 instanceof Error ? error_7.message : 'Unknown error',
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JetonService.prototype.getRouteQuote = function (tokenMintAddress_1, amount_1) {
        return __awaiter(this, arguments, void 0, function (tokenMintAddress, amount, action, rpcUrl) {
            var result, error_8;
            if (action === void 0) { action = 'buy'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log('Getting route quote', {
                            tokenMintAddress: tokenMintAddress,
                            amount: amount,
                            action: action,
                        });
                        return [4 /*yield*/, (0, sdk_1.getRouteQuote)({
                                tokenMintAddress: tokenMintAddress,
                                amount: amount,
                                action: action,
                                rpcUrl: rpcUrl,
                            })];
                    case 1:
                        result = _a.sent();
                        this.logger.log('Route quote completed', {
                            success: result.success,
                        });
                        return [2 /*return*/, result];
                    case 2:
                        error_8 = _a.sent();
                        this.logger.error('Route quote failed', error_8);
                        return [2 /*return*/, {
                                success: false,
                                error: error_8 instanceof Error ? error_8.message : 'Unknown error',
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JetonService.prototype.adaptTokenCreateConfig = function (config) {
        var _a;
        return {
            platform: ((_a = config.options) === null || _a === void 0 ? void 0 : _a.platform) || 'pump', // значение по умолчанию
            metadata: {
                name: config.metadata.name,
                symbol: config.metadata.symbol,
                image: config.metadata.uri, // предполагаем, что `uri` в вашем конфиге = `image` в SDK
            },
            wallets: config.wallets.map(function (w) { return w.address; }), // преобразуем в массив адресов
            amounts: config.wallets.map(function (w) { return w.amount; }), // преобразуем в массив amounts
        };
    };
    JetonService.prototype.getSDK = function () {
        return this.sdk;
    };
    JetonService.prototype.validateTokenBuy = function (wallets, config) {
        return (0, sdk_1.validateTokenBuyInputs)(wallets, config);
    };
    JetonService.prototype.validateTokenSell = function (wallets, config) {
        return (0, sdk_1.validateTokenSellInputs)(wallets, config);
    };
    JetonService.prototype.validateTokenCreate = function (wallets, config) {
        var sdkConfig = this.adaptTokenCreateConfig(config);
        return (0, sdk_1.validateTokenCreateInputs)(wallets, sdkConfig);
    };
    var JetonService_1;
    JetonService = JetonService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [])
    ], JetonService);
    return JetonService;
}());
exports.JetonService = JetonService;
