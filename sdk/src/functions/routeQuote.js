"use strict";
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
exports.validateRouteQuoteInputs = exports.compareQuotes = exports.getSellQuote = exports.getBuyQuote = exports.getRouteQuote = void 0;
var utils_1 = require("../utils");
// Helper class to enhance the API response
var EnhancedRouteQuote = /** @class */ (function () {
    function EnhancedRouteQuote(response) {
        this.success = response.success;
        this.action = response.action;
        this.protocol = response.protocol;
        this.tokenMintAddress = response.tokenMintAddress;
        this.inputAmount = response.inputAmount;
        this.outputAmount = response.outputAmount;
    }
    EnhancedRouteQuote.prototype.getOutputAmountAsNumber = function () {
        return parseFloat(this.outputAmount);
    };
    EnhancedRouteQuote.prototype.getExchangeRate = function () {
        var output = this.getOutputAmountAsNumber();
        return this.inputAmount > 0 ? output / this.inputAmount : 0;
    };
    EnhancedRouteQuote.prototype.isBuyOperation = function () {
        return this.action === 'buy';
    };
    EnhancedRouteQuote.prototype.isSellOperation = function () {
        return this.action === 'sell';
    };
    EnhancedRouteQuote.prototype.getSummary = function () {
        var rate = this.getExchangeRate();
        if (this.isBuyOperation()) {
            return "Buy ".concat(this.inputAmount, " SOL \u2192 ").concat(this.getOutputAmountAsNumber().toLocaleString(), " tokens (Rate: ").concat(rate.toFixed(2), " tokens/SOL) via ").concat(this.protocol);
        }
        else {
            return "Sell ".concat(this.inputAmount.toLocaleString(), " tokens \u2192 ").concat(this.getOutputAmountAsNumber().toLocaleString(), " lamports (Rate: ").concat(rate.toFixed(2), " lamports/token) via ").concat(this.protocol);
        }
    };
    return EnhancedRouteQuote;
}());
/**
 * Get route quote from the API with enhanced result
 */
var getRouteQuote = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var sdkConfig, baseUrl, response, errorText, data, enhancedResult, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                sdkConfig = (0, utils_1.getConfig)();
                baseUrl = (_a = sdkConfig.apiUrl) === null || _a === void 0 ? void 0 : _a.replace(/\/+$/, '');
                (0, utils_1.debugLog)('🔗 [DEBUG] Getting route quote from:', "".concat(baseUrl, "/api/tokens/route"));
                (0, utils_1.debugLog)('📦 [DEBUG] Request payload:', {
                    action: config.action,
                    tokenMintAddress: config.tokenMintAddress,
                    amount: config.amount,
                    rpcUrl: config.rpcUrl || sdkConfig.rpcUrl || 'https://api.mainnet-beta.solana.com'
                });
                return [4 /*yield*/, fetch("".concat(baseUrl, "/api/tokens/route"), {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            action: config.action,
                            tokenMintAddress: config.tokenMintAddress,
                            amount: config.amount,
                            rpcUrl: config.rpcUrl || sdkConfig.rpcUrl || 'https://api.mainnet-beta.solana.com'
                        })
                    })];
            case 1:
                response = _b.sent();
                if (!!response.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, response.text()];
            case 2:
                errorText = _b.sent();
                (0, utils_1.debugError)('❌ [DEBUG] API Error Response:', errorText);
                throw new Error("HTTP error! Status: ".concat(response.status, " - ").concat(errorText));
            case 3: return [4 /*yield*/, response.json()];
            case 4:
                data = _b.sent();
                (0, utils_1.debugLog)('✅ [DEBUG] Route quote API response:', data);
                enhancedResult = new EnhancedRouteQuote(data);
                return [2 /*return*/, {
                        success: true,
                        result: enhancedResult
                    }];
            case 5:
                error_1 = _b.sent();
                (0, utils_1.debugError)('❌ [DEBUG] Route quote error:', error_1);
                return [2 /*return*/, {
                        success: false,
                        error: error_1 instanceof Error ? error_1.message : 'Unknown error occurred'
                    }];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getRouteQuote = getRouteQuote;
/**
 * Convenience method to get a buy quote
 */
var getBuyQuote = function (tokenMintAddress, solAmount, rpcUrl) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (0, exports.getRouteQuote)({
                action: 'buy',
                tokenMintAddress: tokenMintAddress,
                amount: solAmount,
                rpcUrl: rpcUrl
            })];
    });
}); };
exports.getBuyQuote = getBuyQuote;
/**
 * Convenience method to get a sell quote
 */
var getSellQuote = function (tokenMintAddress, tokenAmount, rpcUrl) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (0, exports.getRouteQuote)({
                action: 'sell',
                tokenMintAddress: tokenMintAddress,
                amount: tokenAmount,
                rpcUrl: rpcUrl
            })];
    });
}); };
exports.getSellQuote = getSellQuote;
/**
 * Compare buy and sell quotes for the same token
 */
var compareQuotes = function (tokenMintAddress, solAmount, tokenAmount, rpcUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, buyResult, sellResult, result, buyRate, sellRate;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, Promise.all([
                    (0, exports.getBuyQuote)(tokenMintAddress, solAmount, rpcUrl),
                    (0, exports.getSellQuote)(tokenMintAddress, tokenAmount, rpcUrl)
                ])];
            case 1:
                _a = _b.sent(), buyResult = _a[0], sellResult = _a[1];
                result = {
                    buyQuote: buyResult.result,
                    sellQuote: sellResult.result,
                    buySuccess: buyResult.success,
                    sellSuccess: sellResult.success,
                    comparison: undefined
                };
                if (buyResult.success && sellResult.success && buyResult.result && sellResult.result) {
                    buyRate = buyResult.result.getExchangeRate();
                    sellRate = sellResult.result.getExchangeRate();
                    result.comparison = "Buy: ".concat(buyRate.toFixed(2), " tokens/SOL | Sell: ").concat(sellRate.toFixed(2), " lamports/token");
                }
                return [2 /*return*/, result];
        }
    });
}); };
exports.compareQuotes = compareQuotes;
/**
 * Validate route quote inputs
 */
var validateRouteQuoteInputs = function (config) {
    if (!config.tokenMintAddress || config.tokenMintAddress.trim() === '') {
        return { valid: false, error: 'Token mint address is required' };
    }
    if (!config.amount || config.amount <= 0) {
        return { valid: false, error: 'Amount must be greater than 0' };
    }
    if (!['buy', 'sell'].includes(config.action)) {
        return { valid: false, error: 'Action must be either "buy" or "sell"' };
    }
    return { valid: true };
};
exports.validateRouteQuoteInputs = validateRouteQuoteInputs;
