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
exports.batchDistributeSOL = exports.distributeSOL = exports.validateDistributionInputs = void 0;
var utils_1 = require("../utils");
/**
 * Get partially signed transactions from backend
 * The backend will create and sign with dump wallets
 */
var getDistributeTransactions = function (senderAddress, recipients) { return __awaiter(void 0, void 0, void 0, function () {
    var config, apiUrl, requestPayload, response, data, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                config = (0, utils_1.getConfig)();
                apiUrl = (_a = (config.apiUrl)) === null || _a === void 0 ? void 0 : _a.replace(/\/+$/, '');
                if (!apiUrl) {
                    throw new Error('API URL not configured. Please call configure() with apiUrl or baseUrl first.');
                }
                requestPayload = {
                    sender: senderAddress,
                    recipients: recipients
                };
                // Debug: Log request payload
                (0, utils_1.debugLog)('🔍 [DEBUG] Distribute API Request:');
                (0, utils_1.debugLog)('   URL:', "".concat(apiUrl, "/api/wallets/distribute"));
                (0, utils_1.debugLog)('   Payload:', JSON.stringify(requestPayload, null, 2));
                return [4 /*yield*/, fetch("".concat(apiUrl, "/api/wallets/distribute"), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestPayload),
                    })];
            case 1:
                response = _c.sent();
                if (!response.ok) {
                    (0, utils_1.debugLog)('❌ [DEBUG] HTTP Error Response:');
                    (0, utils_1.debugLog)('   Status:', response.status);
                    (0, utils_1.debugLog)('   Status Text:', response.statusText);
                    throw new Error("HTTP error! Status: ".concat(response.status));
                }
                return [4 /*yield*/, response.json()];
            case 2:
                data = _c.sent();
                // Debug: Log response data
                (0, utils_1.debugLog)('✅ [DEBUG] Distribute API Response:');
                (0, utils_1.debugLog)('   Success:', data.success);
                (0, utils_1.debugLog)('   Transactions Count:', ((_b = data.transactions) === null || _b === void 0 ? void 0 : _b.length) || 0);
                if (data.error) {
                    (0, utils_1.debugLog)('   Error:', data.error);
                }
                if (data.transactions) {
                    (0, utils_1.debugLog)('   Transaction IDs:', data.transactions.map(function (tx, i) { return "".concat(i + 1, ": ").concat(tx.substring(0, 20), "..."); }));
                }
                if (!data.success) {
                    throw new Error(data.error || 'Failed to get partially signed transactions');
                }
                return [2 /*return*/, data.transactions || []]; // Array of base58 encoded partially signed transactions
            case 3:
                error_1 = _c.sent();
                (0, utils_1.debugError)('Error getting partially prepared transactions:', error_1);
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Validate distribution inputs
 */
var validateDistributionInputs = function (senderWallet, recipientWallets, senderBalance) {
    // Check if sender wallet is valid
    if (!(0, utils_1.validateWallet)(senderWallet)) {
        return { valid: false, error: 'Invalid sender wallet' };
    }
    // Check if recipient wallets are valid
    if (!recipientWallets.length) {
        return { valid: false, error: 'No recipient wallets' };
    }
    for (var _i = 0, recipientWallets_1 = recipientWallets; _i < recipientWallets_1.length; _i++) {
        var wallet = recipientWallets_1[_i];
        if (!(0, utils_1.validateWallet)(wallet)) {
            return { valid: false, error: 'Invalid recipient wallet data' };
        }
        if (!wallet.amount) {
            return { valid: false, error: 'Recipient wallet must have an amount specified' };
        }
        if (!(0, utils_1.validateAmount)(wallet.amount)) {
            return { valid: false, error: 'Invalid amount: ' + wallet.amount };
        }
    }
    // Calculate total amount
    var totalAmount = recipientWallets.reduce(function (sum, wallet) { return sum + parseFloat(wallet.amount); }, 0);
    // Check if sender has enough balance (including some extra for fees) - only if balance is provided
    if (senderBalance !== undefined) {
        var estimatedFee = 0.01; // Rough estimate for fees in SOL
        if (totalAmount + estimatedFee > senderBalance) {
            return {
                valid: false,
                error: "Insufficient balance. Need at least ".concat(totalAmount + estimatedFee, " SOL, but have ").concat(senderBalance, " SOL")
            };
        }
    }
    return { valid: true };
};
exports.validateDistributionInputs = validateDistributionInputs;
/**
 * Execute SOL distribution
 */
var distributeSOL = function (senderWallet, recipientWallets) { return __awaiter(void 0, void 0, void 0, function () {
    var senderAddress, recipients, DistributeTransactions, senderKeypair, recipientKeypairsMap, fullySignedTransactions, distributionBundles, results, i, bundle, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                senderAddress = (0, utils_1.getWalletAddress)(senderWallet.privateKey);
                console.log("Preparing to distribute SOL from ".concat(senderAddress, " to ").concat(recipientWallets.length, " recipients"));
                recipients = recipientWallets.map(function (wallet) { return ({
                    address: (0, utils_1.getWalletAddress)(wallet.privateKey),
                    amount: wallet.amount, // Non-null assertion since validation ensures amount exists
                    privateKey: wallet.privateKey
                }); });
                return [4 /*yield*/, getDistributeTransactions(senderAddress, recipients)];
            case 1:
                DistributeTransactions = _a.sent();
                console.log("Received ".concat(DistributeTransactions.length, " partially signed transactions from backend"));
                senderKeypair = (0, utils_1.createKeypairFromPrivateKey)(senderWallet.privateKey);
                recipientKeypairsMap = (0, utils_1.createKeypairMap)(recipientWallets);
                fullySignedTransactions = (0, utils_1.completeTransactionSigning)(DistributeTransactions, senderKeypair, recipientKeypairsMap);
                console.log("Completed signing for ".concat(fullySignedTransactions.length, " transactions"));
                distributionBundles = (0, utils_1.prepareTransactionBundles)(fullySignedTransactions);
                console.log("Prepared ".concat(distributionBundles.length, " distribution bundles"));
                results = [];
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < distributionBundles.length)) return [3 /*break*/, 6];
                bundle = distributionBundles[i];
                console.log("Sending bundle ".concat(i + 1, "/").concat(distributionBundles.length, " with ").concat(bundle.transactions.length, " transactions"));
                return [4 /*yield*/, (0, utils_1.sendBundle)(bundle.transactions)];
            case 3:
                result = _a.sent();
                results.push(result);
                if (!(i < distributionBundles.length - 1)) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, utils_1.delay)(500)];
            case 4:
                _a.sent(); // 500ms delay
                _a.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 2];
            case 6: return [2 /*return*/, {
                    success: true,
                    result: results
                }];
            case 7:
                error_2 = _a.sent();
                console.error('SOL distribution error:', error_2);
                return [2 /*return*/, {
                        success: false,
                        error: error_2 instanceof Error ? error_2.message : 'Unknown error'
                    }];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.distributeSOL = distributeSOL;
/**
 * Batch distribute SOL to multiple recipients, splitting into groups of max 3 recipients per request
 */
var batchDistributeSOL = function (senderWallet, recipientWallets) { return __awaiter(void 0, void 0, void 0, function () {
    var result, MAX_RECIPIENTS_PER_BATCH, batches, i, results, i, batch, batchResult, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                console.log("Starting batch SOL distribution to ".concat(recipientWallets.length, " recipients"));
                // Return early if no recipients
                if (recipientWallets.length === 0) {
                    return [2 /*return*/, { success: true, results: [] }];
                }
                if (!(recipientWallets.length <= 3)) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, exports.distributeSOL)(senderWallet, recipientWallets)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, {
                        success: result.success,
                        results: result.success ? [result.result] : [],
                        error: result.error
                    }];
            case 2:
                MAX_RECIPIENTS_PER_BATCH = 3;
                batches = [];
                for (i = 0; i < recipientWallets.length; i += MAX_RECIPIENTS_PER_BATCH) {
                    batches.push(recipientWallets.slice(i, i + MAX_RECIPIENTS_PER_BATCH));
                }
                console.log("Split distribution into ".concat(batches.length, " batches of max ").concat(MAX_RECIPIENTS_PER_BATCH, " recipients each"));
                results = [];
                i = 0;
                _a.label = 3;
            case 3:
                if (!(i < batches.length)) return [3 /*break*/, 7];
                batch = batches[i];
                console.log("Processing batch ".concat(i + 1, "/").concat(batches.length, " with ").concat(batch.length, " recipients"));
                return [4 /*yield*/, (0, exports.distributeSOL)(senderWallet, batch)];
            case 4:
                batchResult = _a.sent();
                if (!batchResult.success) {
                    return [2 /*return*/, {
                            success: false,
                            results: results,
                            error: "Batch ".concat(i + 1, " failed: ").concat(batchResult.error)
                        }];
                }
                // Add batch result
                results.push(batchResult.result);
                if (!(i < batches.length - 1)) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, utils_1.delay)(3000)];
            case 5:
                _a.sent(); // 3 second delay between batches
                _a.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 3];
            case 7: return [2 /*return*/, {
                    success: true,
                    results: results
                }];
            case 8:
                error_3 = _a.sent();
                console.error('Batch SOL distribution error:', error_3);
                return [2 /*return*/, {
                        success: false,
                        error: error_3 instanceof Error ? error_3.message : 'Unknown error'
                    }];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.batchDistributeSOL = batchDistributeSOL;
