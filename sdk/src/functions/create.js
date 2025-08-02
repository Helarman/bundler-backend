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
exports.createTokenBatch = exports.createTokenSingle = exports.validateTokenCreateInputs = void 0;
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
 * Validate token creation inputs
 */
var validateTokenCreateInputs = function (wallets, config) {
    try {
        // Validate wallets
        if (!wallets || wallets.length === 0) {
            return { valid: false, error: 'At least one wallet is required' };
        }
        if (wallets.length > 5) {
            return { valid: false, error: 'Maximum 5 wallets allowed' };
        }
        // Validate each wallet
        for (var i = 0; i < wallets.length; i++) {
            var isValidWallet = (0, utils_1.validateWallet)(wallets[i]);
            if (!isValidWallet) {
                return { valid: false, error: "Wallet ".concat(i + 1, ": Invalid private key format") };
            }
        }
        // Validate platform
        if (!config.platform) {
            return { valid: false, error: 'Platform is required' };
        }
        var supportedPlatforms = ['pump', 'moon', 'bonk', 'cook', 'boop'];
        if (!supportedPlatforms.includes(config.platform)) {
            return { valid: false, error: "Unsupported platform: ".concat(config.platform, ". Supported platforms: ").concat(supportedPlatforms.join(', ')) };
        }
        // Validate metadata
        if (!config.metadata) {
            return { valid: false, error: 'Token metadata is required' };
        }
        if (!config.metadata.name || !config.metadata.symbol || !config.metadata.image) {
            return { valid: false, error: 'Token name, symbol, and image are required' };
        }
        // Validate amounts
        if (Array.isArray(config.amounts)) {
            for (var i = 0; i < config.amounts.length; i++) {
                if (config.amounts[i] <= 0) {
                    return { valid: false, error: "Amount ".concat(i + 1, ": must be greater than 0") };
                }
            }
        }
        else {
            if (config.amounts <= 0) {
                return { valid: false, error: 'Amount must be greater than 0' };
            }
        }
        // Validate wallet addresses
        if (!config.wallets || config.wallets.length === 0) {
            return { valid: false, error: 'At least one wallet address is required' };
        }
        if (config.wallets.length !== wallets.length) {
            return { valid: false, error: 'Number of wallet addresses must match number of wallets' };
        }
        return { valid: true };
    }
    catch (error) {
        return { valid: false, error: "Validation error: ".concat(error) };
    }
};
exports.validateTokenCreateInputs = validateTokenCreateInputs;
/**
 * Get token creation transactions from backend
 */
var getTokenCreateTransactions = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var sdkConfig, baseUrl, response, errorText, data, transactions, maxTransactionsPerBundle, bundles, i, chunk, transactions, maxTransactionsPerBundle, bundles, i, chunk, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                sdkConfig = (0, utils_1.getConfig)();
                baseUrl = (_a = sdkConfig.apiUrl) === null || _a === void 0 ? void 0 : _a.replace(/\/+$/, '');
                (0, utils_1.debugLog)('🔗 [DEBUG] Getting token creation transactions from:', "".concat(baseUrl, "/api/create"));
                (0, utils_1.debugLog)('📦 [DEBUG] Request payload:', config);
                return [4 /*yield*/, fetch("".concat(baseUrl, "/api/create"), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(config),
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
                (0, utils_1.debugLog)('✅ [DEBUG] Token creation API response:', data);
                if (!data.success) {
                    throw new Error(data.error || 'Failed to get token creation transactions');
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
                (0, utils_1.debugError)('Error getting token creation transactions:', error_1);
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
    // Use the first keypair as sender (creator)
    var senderKeypair = walletKeypairs[0];
    // Use completeTransactionSigning from utils
    var signedTransactions = (0, utils_1.completeTransactionSigning)(bundle.transactions, senderKeypair, keypairMap);
    return { transactions: signedTransactions };
};
/**
 * Create token with single configuration
 */
var createTokenSingle = function (wallets, config) { return __awaiter(void 0, void 0, void 0, function () {
    var validation, bundles, walletKeypairs, results, i, bundle, signedBundle, bundleResult, error_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                console.log("\uD83D\uDE80 Starting token creation on ".concat(config.platform, " platform"));
                console.log("\uD83D\uDCDD Token: ".concat(config.metadata.name, " (").concat(config.metadata.symbol, ")"));
                console.log("\uD83D\uDC65 Wallets: ".concat(wallets.length));
                validation = (0, exports.validateTokenCreateInputs)(wallets, config);
                if (!validation.valid) {
                    return [2 /*return*/, {
                            success: false,
                            error: validation.error
                        }];
                }
                // Check rate limit
                return [4 /*yield*/, checkRateLimit()];
            case 1:
                // Check rate limit
                _a.sent();
                return [4 /*yield*/, getTokenCreateTransactions(config)];
            case 2:
                bundles = _a.sent();
                console.log("\uD83D\uDCE6 Received ".concat(bundles.length, " bundles from backend"));
                if (!bundles || bundles.length === 0) {
                    return [2 /*return*/, {
                            success: false,
                            error: 'No transaction bundles received from backend'
                        }];
                }
                walletKeypairs = wallets.map(function (wallet) { return (0, utils_1.createKeypairFromPrivateKey)(wallet.privateKey); });
                console.log("\uD83D\uDD11 Created ".concat(walletKeypairs.length, " keypairs from wallets"));
                results = [];
                i = 0;
                _a.label = 3;
            case 3:
                if (!(i < bundles.length)) return [3 /*break*/, 10];
                bundle = bundles[i];
                console.log("\uD83D\uDD04 Processing bundle ".concat(i + 1, "/").concat(bundles.length, " with ").concat(bundle.transactions.length, " transactions"));
                console.log("\uD83D\uDCCB Bundle ".concat(i + 1, " transactions:"), bundle.transactions.map(function (tx, idx) { return "".concat(idx, ": ").concat(tx.substring(0, 20), "..."); }));
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                signedBundle = completeBundleSigning(bundle, walletKeypairs);
                console.log("\u2705 Bundle ".concat(i + 1, " signed successfully with ").concat(signedBundle.transactions.length, " transactions"));
                console.log("\uD83D\uDCCB Signed bundle ".concat(i + 1, " transactions:"), signedBundle.transactions.map(function (tx, idx) { return "".concat(idx, ": ").concat(tx.substring(0, 20), "..."); }));
                return [4 /*yield*/, (0, utils_1.sendBundle)(signedBundle.transactions)];
            case 5:
                bundleResult = _a.sent();
                console.log("\uD83D\uDE80 Bundle ".concat(i + 1, " sent:"), bundleResult);
                results.push(bundleResult);
                return [3 /*break*/, 7];
            case 6:
                error_2 = _a.sent();
                console.error("\u274C Error processing bundle ".concat(i + 1, ":"), error_2);
                results.push({
                    jsonrpc: '2.0',
                    id: i,
                    error: {
                        code: -1,
                        message: error_2 instanceof Error ? error_2.message : 'Unknown error'
                    }
                });
                return [3 /*break*/, 7];
            case 7:
                if (!(i < bundles.length - 1)) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, utils_1.delay)(100)];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                i++;
                return [3 /*break*/, 3];
            case 10: return [2 /*return*/, {
                    success: true,
                    result: results
                }];
            case 11:
                error_3 = _a.sent();
                console.error('❌ Token creation failed:', error_3);
                return [2 /*return*/, {
                        success: false,
                        error: error_3 instanceof Error ? error_3.message : 'Unknown error occurred'
                    }];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.createTokenSingle = createTokenSingle;
/**
 * Create tokens in batch with multiple configurations
 */
var createTokenBatch = function (walletConfigs) { return __awaiter(void 0, void 0, void 0, function () {
    var allResults, i, _a, wallets, config, result, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                console.log("\uD83D\uDE80 Starting batch token creation for ".concat(walletConfigs.length, " configurations"));
                allResults = [];
                i = 0;
                _b.label = 1;
            case 1:
                if (!(i < walletConfigs.length)) return [3 /*break*/, 5];
                _a = walletConfigs[i], wallets = _a.wallets, config = _a.config;
                console.log("\n\uD83D\uDCE6 Processing configuration ".concat(i + 1, "/").concat(walletConfigs.length));
                return [4 /*yield*/, (0, exports.createTokenSingle)(wallets, config)];
            case 2:
                result = _b.sent();
                if (result.success && result.result) {
                    allResults.push(result.result);
                }
                else {
                    console.error("\u274C Configuration ".concat(i + 1, " failed:"), result.error);
                    // Add empty result to maintain array structure
                    allResults.push([]);
                }
                if (!(i < walletConfigs.length - 1)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, utils_1.delay)(500)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/, {
                    success: true,
                    result: allResults
                }];
            case 6:
                error_4 = _b.sent();
                console.error('❌ Batch token creation failed:', error_4);
                return [2 /*return*/, {
                        success: false,
                        error: error_4 instanceof Error ? error_4.message : 'Unknown error occurred'
                    }];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.createTokenBatch = createTokenBatch;
