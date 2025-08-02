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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MixerService = void 0;
var common_1 = require("@nestjs/common");
var web3_js_1 = require("@solana/web3.js");
var bs58 = __importStar(require("bs58"));
var MixerService = /** @class */ (function () {
    function MixerService() {
        this.logger = new common_1.Logger(MixerService_1.name);
        this.dumpWallets = [];
        this.defaultConfig = {
            minAmount: 0.001,
            maxAmount: 0.1,
            minDelay: 1000,
            maxDelay: 5000,
            mixingRounds: 3,
            useRandomAmounts: true,
            enableTimingVariation: true
        };
        this.initializeDumpWallets();
        this.logger.log("SOL Mixer Service initialized with ".concat(this.dumpWallets.length, " dump wallets"));
    }
    MixerService_1 = MixerService;
    MixerService.prototype.initializeDumpWallets = function () {
        for (var i = 1; i <= 20; i++) {
            var privateKey = process.env["MIXER_DUMP_WALLET_".concat(i)];
            if (privateKey) {
                try {
                    web3_js_1.Keypair.fromSecretKey(bs58.decode(privateKey));
                    this.dumpWallets.push({ privateKey: privateKey });
                }
                catch (error) {
                    this.logger.warn("Invalid mixer dump wallet ".concat(i, ": ").concat(error.message));
                }
            }
        }
        if (this.dumpWallets.length === 0) {
            this.logger.warn('No mixer dump wallets configured, generating temporary ones');
            for (var i = 0; i < 10; i++) {
                var keypair = web3_js_1.Keypair.generate();
                this.dumpWallets.push({
                    privateKey: bs58.encode(keypair.secretKey)
                });
            }
        }
    };
    MixerService.prototype.generateRandomAmount = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    MixerService.prototype.generateRandomDelay = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };
    MixerService.prototype.selectRandomDumpWallets = function (count) {
        var shuffled = __spreadArray([], this.dumpWallets, true).sort(function () { return 0.5 - Math.random(); });
        return shuffled.slice(0, Math.min(count, shuffled.length));
    };
    MixerService.prototype.createMixingPath = function (sender, recipient, config) {
        var _a;
        var steps = [];
        var intermediaryWallets = this.selectRandomDumpWallets(config.mixingRounds);
        var currentFrom = sender.privateKey;
        var totalAmount = parseFloat(sender.amount || '0');
        var amounts = [];
        var remainingAmount = totalAmount;
        for (var i = 0; i < config.mixingRounds; i++) {
            if (i === config.mixingRounds - 1) {
                amounts.push(remainingAmount);
            }
            else {
                var chunkSize = config.useRandomAmounts
                    ? this.generateRandomAmount(Math.min(config.minAmount, remainingAmount * 0.1), Math.min(config.maxAmount, remainingAmount * 0.8))
                    : remainingAmount / config.mixingRounds;
                amounts.push(chunkSize);
                remainingAmount -= chunkSize;
            }
        }
        for (var round = 0; round < config.mixingRounds; round++) {
            var isLastRound = round === config.mixingRounds - 1;
            var targetWallet = isLastRound
                ? recipient.privateKey
                : (_a = intermediaryWallets[round]) === null || _a === void 0 ? void 0 : _a.privateKey;
            if (!targetWallet)
                continue;
            var delay = config.enableTimingVariation
                ? this.generateRandomDelay(config.minDelay, config.maxDelay)
                : config.minDelay;
            steps.push({
                from: currentFrom,
                to: targetWallet,
                amount: amounts[round],
                delay: delay,
                round: round + 1
            });
            currentFrom = targetWallet;
        }
        return steps;
    };
    MixerService.prototype.mixSOLSingle = function (sender, recipient, config) {
        return __awaiter(this, void 0, void 0, function () {
            var mixerConfig, steps, totalMixed, _loop_1, this_1, _i, steps_1, step, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mixerConfig = __assign(__assign({}, this.defaultConfig), config);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        this.logger.log("Starting single SOL mix operation for ".concat(sender.privateKey.slice(0, 8), "..."));
                        steps = this.createMixingPath(sender, recipient, mixerConfig);
                        if (steps.length === 0) {
                            throw new Error('Failed to create mixing path');
                        }
                        totalMixed = 0;
                        _loop_1 = function (step) {
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        this_1.logger.debug("Executing mixing step ".concat(step.round, "/").concat(mixerConfig.mixingRounds));
                                        return [4 /*yield*/, this_1.simulateMixingStep(step)];
                                    case 1:
                                        _b.sent();
                                        totalMixed += step.amount;
                                        if (!(step.round < mixerConfig.mixingRounds)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, step.delay); })];
                                    case 2:
                                        _b.sent();
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, steps_1 = steps;
                        _a.label = 2;
                    case 2:
                        if (!(_i < steps_1.length)) return [3 /*break*/, 5];
                        step = steps_1[_i];
                        return [5 /*yield**/, _loop_1(step)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        this.logger.log("SOL mix operation completed successfully. Total mixed: ".concat(totalMixed));
                        return [2 /*return*/, {
                                success: true,
                                steps: steps,
                                totalMixed: totalMixed
                            }];
                    case 6:
                        error_1 = _a.sent();
                        this.logger.error("SOL mix operation failed: ".concat(error_1.message));
                        return [2 /*return*/, {
                                success: false,
                                steps: [],
                                totalMixed: 0,
                                error: error_1.message
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MixerService.prototype.mixSOLBatch = function (senderWallet, recipientWallets, config) {
        return __awaiter(this, void 0, void 0, function () {
            var mixerConfig, results, totalAmount, amountPerRecipient, _loop_2, this_2, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mixerConfig = __assign(__assign({}, this.defaultConfig), config);
                        this.logger.log("Starting batch SOL mix operation for ".concat(recipientWallets.length, " recipients"));
                        results = [];
                        totalAmount = parseFloat(senderWallet.amount || '0');
                        amountPerRecipient = totalAmount / recipientWallets.length;
                        _loop_2 = function (i) {
                            var recipient, senderForThisRound, batchDelay_1, result;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        recipient = recipientWallets[i];
                                        senderForThisRound = __assign(__assign({}, senderWallet), { amount: amountPerRecipient.toString() });
                                        if (!(i > 0 && mixerConfig.enableTimingVariation)) return [3 /*break*/, 2];
                                        batchDelay_1 = this_2.generateRandomDelay(2000, 8000);
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, batchDelay_1); })];
                                    case 1:
                                        _b.sent();
                                        _b.label = 2;
                                    case 2: return [4 /*yield*/, this_2.mixSOLSingle(senderForThisRound, recipient, mixerConfig)];
                                    case 3:
                                        result = _b.sent();
                                        results.push(result);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < recipientWallets.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_2(i)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, results];
                }
            });
        });
    };
    MixerService.prototype.simulateMixingStep = function (step) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Simulating mix step ".concat(step.round));
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MixerService.prototype.validateMixerConfig = function (config) {
        if (config.minAmount && config.maxAmount && config.minAmount >= config.maxAmount) {
            return { valid: false, error: 'minAmount must be less than maxAmount' };
        }
        if (config.mixingRounds && (config.mixingRounds < 1 || config.mixingRounds > 10)) {
            return { valid: false, error: 'mixingRounds must be between 1 and 10' };
        }
        if (config.minDelay && config.maxDelay && config.minDelay >= config.maxDelay) {
            return { valid: false, error: 'minDelay must be less than maxDelay' };
        }
        return { valid: true };
    };
    MixerService.prototype.getMixerStats = function () {
        return {
            availableDumpWallets: this.dumpWallets.length,
            defaultConfig: this.defaultConfig,
            supportedFeatures: [
                'Single wallet mixing',
                'Batch wallet mixing',
                'Random amount distribution',
                'Timing variation',
                'Multi-round mixing',
                'Configurable parameters'
            ]
        };
    };
    var MixerService_1;
    MixerService = MixerService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [])
    ], MixerService);
    return MixerService;
}());
exports.MixerService = MixerService;
