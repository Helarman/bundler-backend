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
exports.validateTokenSellInputs = exports.sellTokenBatch = exports.sellTokenSingle = void 0;
var web3_js_1 = require("@solana/web3.js");
var bs58_1 = __importDefault(require("bs58"));
var utils_1 = require("../utils");
// Constants
var MAX_BUNDLES_PER_SECOND = 2;
// Rate limiting state
var rateLimitState = {
    count: 0,
    lastReset: Date.now(),
    maxBundlesPerSecond: MAX_BUNDLES_PER_SECOND
};
/**
 * Check rate limit and wait if necessary
 */
var checkRateLimit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var now, waitTime;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                now = Date.now();
                if (now - rateLimitState.lastReset >= 1000) {
                    rateLimitState.count = 0;
                    rateLimitState.lastReset = now;
                }
                if (!(rateLimitState.count >= rateLimitState.maxBundlesPerSecond)) return [3 /*break*/, 2];
                waitTime = 1000 - (now - rateLimitState.lastReset);
                return [4 /*yield*/, (0, utils_1.delay)(waitTime)];
            case 1:
                _a.sent();
                rateLimitState.count = 0;
                rateLimitState.lastReset = Date.now();
                _a.label = 2;
            case 2:
                rateLimitState.count++;
                return [2 /*return*/];
        }
    });
}); };
/**
 * Get partially prepared sell transactions from backend
 */
var getTokenSellTransactions = function (walletAddresses, tokenConfig) { return __awaiter(void 0, void 0, void 0, function () {
    var config, baseUrl, response, errorText, data, transactions, maxTransactionsPerBundle, bundles, i, chunk, transactions, maxTransactionsPerBundle, bundles, i, chunk, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                config = (0, utils_1.getConfig)();
                baseUrl = (_a = config.apiUrl) === null || _a === void 0 ? void 0 : _a.replace(/\/+$/, '');
                (0, utils_1.debugLog)('🔗 [DEBUG] Getting token sell transactions from:', "".concat(baseUrl, "/api/tokens/sell"));
                (0, utils_1.debugLog)('📦 [DEBUG] Request payload:', {
                    walletAddresses: walletAddresses,
                    tokenAddress: tokenConfig.tokenAddress,
                    protocol: tokenConfig.protocol,
                    percentage: tokenConfig.sellPercent,
                    slippageBps: tokenConfig.slippageBps || 100,
                    jitoTipLamports: tokenConfig.jitoTipLamports || 5000
                });
                return [4 /*yield*/, fetch("".concat(baseUrl, "/api/tokens/sell"), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            walletAddresses: walletAddresses,
                            tokenAddress: tokenConfig.tokenAddress,
                            protocol: tokenConfig.protocol,
                            percentage: tokenConfig.sellPercent,
                            slippageBps: tokenConfig.slippageBps || 100, // Default 1% slippage
                            jitoTipLamports: tokenConfig.jitoTipLamports || 5000 // Default tip
                        }),
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
                (0, utils_1.debugLog)('✅ [DEBUG] Token sell API response:', data);
                if (!data.success) {
                    throw new Error(data.error || 'Failed to get token sell transactions');
                }
                // Handle different response formats
                if (data.bundles && Array.isArray(data.bundles)) {
                    return [2 /*return*/, data.bundles.map(function (bundle) {
                            return Array.isArray(bundle) ? { transactions: bundle } : bundle;
                        })];
                }
                else if (data.transactions && Array.isArray(data.transactions)) {
                    transactions = data.transactions;
                    maxTransactionsPerBundle = 5;
                    bundles = [];
                    for (i = 0; i < transactions.length; i += maxTransactionsPerBundle) {
                        chunk = transactions.slice(i, i + maxTransactionsPerBundle);
                        bundles.push({ transactions: chunk });
                    }
                    console.log("\uD83D\uDCE6 Split ".concat(transactions.length, " transactions into ").concat(bundles.length, " bundles (max ").concat(maxTransactionsPerBundle, " per bundle)"));
                    return [2 /*return*/, bundles];
                }
                else if (Array.isArray(data)) {
                    transactions = data;
                    maxTransactionsPerBundle = 5;
                    bundles = [];
                    for (i = 0; i < transactions.length; i += maxTransactionsPerBundle) {
                        chunk = transactions.slice(i, i + maxTransactionsPerBundle);
                        bundles.push({ transactions: chunk });
                    }
                    console.log("\uD83D\uDCE6 Split ".concat(transactions.length, " transactions into ").concat(bundles.length, " bundles (max ").concat(maxTransactionsPerBundle, " per bundle)"));
                    return [2 /*return*/, bundles];
                }
                else {
                    throw new Error('No transactions returned from backend');
                }
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                (0, utils_1.debugError)('Error getting token sell transactions:', error_1);
                throw error_1;
            case 6: return [2 /*return*/];
        }
    });
}); };
/**
 * Complete bundle signing with wallet keypairs using utils function
 */
var completeBundleSigning = function (bundle, walletKeypairs) {
    if (!bundle.transactions || !Array.isArray(bundle.transactions)) {
        console.error("Invalid bundle format, transactions property is missing or not an array:", bundle);
        return { transactions: [] };
    }
    // Create a map of public keys to keypairs for the utils function
    var keypairMap = new Map();
    walletKeypairs.forEach(function (kp) {
        keypairMap.set(kp.publicKey.toBase58(), kp);
    });
    // Use the first keypair as sender (primary signer)
    var senderKeypair = walletKeypairs[0];
    // Use completeTransactionSigning from utils
    var signedTransactions = (0, utils_1.completeTransactionSigning)(bundle.transactions, senderKeypair, keypairMap);
    return { transactions: signedTransactions };
};
/**
 * Execute token sell operation for a single wallet
 */
var sellTokenSingle = function (wallet, tokenConfig) { return __awaiter(void 0, void 0, void 0, function () {
    var validation, keypair_1, walletAddress, partiallyPreparedBundles, signedBundles, results, i, bundle, result, error_2, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                console.log("\uD83D\uDE80 Starting single token sell for ".concat(tokenConfig.protocol, " protocol"));
                console.log("\uD83D\uDCDD Token: ".concat(tokenConfig.tokenAddress));
                console.log("\uD83D\uDCB0 Sell Percentage: ".concat(tokenConfig.sellPercent, "%"));
                validation = (0, exports.validateTokenSellInputs)([wallet], tokenConfig);
                if (!validation.valid) {
                    return [2 /*return*/, {
                            success: false,
                            error: validation.error
                        }];
                }
                keypair_1 = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(wallet.privateKey));
                walletAddress = keypair_1.publicKey.toBase58();
                return [4 /*yield*/, getTokenSellTransactions([walletAddress], tokenConfig)];
            case 1:
                partiallyPreparedBundles = _a.sent();
                console.log("\uD83D\uDCE6 Received ".concat(partiallyPreparedBundles.length, " bundles from backend"));
                signedBundles = partiallyPreparedBundles.map(function (bundle) {
                    return completeBundleSigning(bundle, [keypair_1]);
                });
                console.log("\u270D\uFE0F  Completed signing for ".concat(signedBundles.length, " bundles"));
                results = [];
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < signedBundles.length)) return [3 /*break*/, 7];
                bundle = signedBundles[i];
                console.log("\uD83D\uDCE4 Sending bundle ".concat(i + 1, "/").concat(signedBundles.length, " with ").concat(bundle.transactions.length, " transactions"));
                return [4 /*yield*/, checkRateLimit()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, utils_1.sendBundle)(bundle.transactions)];
            case 4:
                result = _a.sent();
                results.push(result);
                if (!(i < signedBundles.length - 1)) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, utils_1.delay)(500)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 2];
            case 7:
                console.log("\u2705 Successfully completed token sell operation");
                return [2 /*return*/, {
                        success: true,
                        result: results
                    }];
            case 8:
                error_2 = _a.sent();
                errorMessage = error_2 instanceof Error ? error_2.message : String(error_2);
                console.error('❌ Token sell error:', errorMessage);
                return [2 /*return*/, {
                        success: false,
                        error: errorMessage
                    }];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.sellTokenSingle = sellTokenSingle;
/**
 * Execute token sell operation for multiple wallets (batch)
 */
var sellTokenBatch = function (wallets, tokenConfig, customPercentages) { return __awaiter(void 0, void 0, void 0, function () {
    var validation, walletKeypairs_1, walletAddresses, partiallyPreparedBundles, i, customConfig, walletBundles, signedBundles, results, i, bundle, result, error_3, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 14, , 15]);
                console.log("\uD83D\uDE80 Starting batch token sell for ".concat(tokenConfig.protocol, " protocol"));
                console.log("\uD83D\uDCDD Token: ".concat(tokenConfig.tokenAddress));
                console.log("\uD83D\uDC65 Wallets: ".concat(wallets.length));
                console.log("\uD83D\uDCB0 Sell Percentage: ".concat(tokenConfig.sellPercent, "% per wallet"));
                validation = (0, exports.validateTokenSellInputs)(wallets, tokenConfig);
                if (!validation.valid) {
                    return [2 /*return*/, {
                            success: false,
                            error: validation.error
                        }];
                }
                walletKeypairs_1 = wallets.map(function (wallet) {
                    return web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(wallet.privateKey));
                });
                walletAddresses = walletKeypairs_1.map(function (kp) { return kp.publicKey.toBase58(); });
                partiallyPreparedBundles = void 0;
                if (!(customPercentages && customPercentages.length > 0)) return [3 /*break*/, 5];
                // Handle custom percentages by making separate API calls
                console.log('🎯 Using custom percentages, making individual API calls');
                partiallyPreparedBundles = [];
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < walletAddresses.length)) return [3 /*break*/, 4];
                customConfig = __assign(__assign({}, tokenConfig), { sellPercent: customPercentages[i] || tokenConfig.sellPercent });
                return [4 /*yield*/, getTokenSellTransactions([walletAddresses[i]], customConfig)];
            case 2:
                walletBundles = _a.sent();
                partiallyPreparedBundles.push.apply(partiallyPreparedBundles, walletBundles);
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, getTokenSellTransactions(walletAddresses, tokenConfig)];
            case 6:
                // Use uniform percentage for all wallets
                partiallyPreparedBundles = _a.sent();
                _a.label = 7;
            case 7:
                console.log("\uD83D\uDCE6 Received ".concat(partiallyPreparedBundles.length, " bundles from backend"));
                signedBundles = partiallyPreparedBundles.map(function (bundle) {
                    return completeBundleSigning(bundle, walletKeypairs_1);
                });
                console.log("\u270D\uFE0F  Completed signing for ".concat(signedBundles.length, " bundles"));
                results = [];
                i = 0;
                _a.label = 8;
            case 8:
                if (!(i < signedBundles.length)) return [3 /*break*/, 13];
                bundle = signedBundles[i];
                console.log("\uD83D\uDCE4 Sending bundle ".concat(i + 1, "/").concat(signedBundles.length, " with ").concat(bundle.transactions.length, " transactions"));
                return [4 /*yield*/, checkRateLimit()];
            case 9:
                _a.sent();
                return [4 /*yield*/, (0, utils_1.sendBundle)(bundle.transactions)];
            case 10:
                result = _a.sent();
                results.push([result]); // Wrap in array for consistency
                if (!(i < signedBundles.length - 1)) return [3 /*break*/, 12];
                return [4 /*yield*/, (0, utils_1.delay)(500)];
            case 11:
                _a.sent();
                _a.label = 12;
            case 12:
                i++;
                return [3 /*break*/, 8];
            case 13:
                console.log("\u2705 Successfully completed batch token sell operation");
                return [2 /*return*/, {
                        success: true,
                        result: results
                    }];
            case 14:
                error_3 = _a.sent();
                errorMessage = error_3 instanceof Error ? error_3.message : String(error_3);
                console.error('❌ Batch token sell error:', errorMessage);
                return [2 /*return*/, {
                        success: false,
                        error: errorMessage
                    }];
            case 15: return [2 /*return*/];
        }
    });
}); };
exports.sellTokenBatch = sellTokenBatch;
/**
 * Validate token sell inputs
 */
var validateTokenSellInputs = function (wallets, tokenConfig) {
    // Check if token config is valid
    if (!tokenConfig.tokenAddress) {
        return { valid: false, error: 'Invalid token address' };
    }
    // Validate sell percentage
    if (isNaN(tokenConfig.sellPercent) || tokenConfig.sellPercent <= 0 || tokenConfig.sellPercent > 100) {
        return { valid: false, error: 'Invalid sell percentage (must be between 1-100)' };
    }
    // Validate protocol
    var supportedProtocols = ['pumpfun', 'moonshot', 'launchpad', 'raydium', 'pumpswap', 'jupiter', 'boopfun'];
    if (!supportedProtocols.includes(tokenConfig.protocol)) {
        return { valid: false, error: "Unsupported protocol: ".concat(tokenConfig.protocol, ". Supported: ").concat(supportedProtocols.join(', ')) };
    }
    // Check if wallets are valid
    if (!wallets.length) {
        return { valid: false, error: 'No wallets provided' };
    }
    for (var _i = 0, wallets_1 = wallets; _i < wallets_1.length; _i++) {
        var wallet = wallets_1[_i];
        if (!(0, utils_1.validateWallet)(wallet)) {
            return { valid: false, error: 'Invalid wallet private key' };
        }
        try {
            // Validate private key format using utils function
            (0, utils_1.createKeypairFromPrivateKey)(wallet.privateKey);
        }
        catch (error) {
            return { valid: false, error: 'Invalid private key format' };
        }
    }
    return { valid: true };
};
exports.validateTokenSellInputs = validateTokenSellInputs;
