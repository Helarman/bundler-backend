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
exports.batchMixSOL = exports.mixSOLToSingleRecipient = exports.validateMixingInputs = exports.validateSingleMixingInputs = void 0;
var utils_1 = require("../utils");
/**
 * Get partially signed transactions from backend for mixing
 * The backend will create and sign with dump wallets
 */
var getMixerTransactions = function (senderAddress, recipients) { return __awaiter(void 0, void 0, void 0, function () {
    var config, apiUrl, requestPayload, response, errorText, data, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
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
                (0, utils_1.debugLog)('🔍 [DEBUG] Mixer API Request:');
                (0, utils_1.debugLog)('   URL:', "".concat(apiUrl, "/api/wallets/mixer"));
                (0, utils_1.debugLog)('   Payload:', JSON.stringify(requestPayload, null, 2));
                return [4 /*yield*/, fetch("".concat(apiUrl, "/api/wallets/mixer"), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestPayload),
                    })];
            case 1:
                response = _c.sent();
                if (!!response.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, response.text()];
            case 2:
                errorText = _c.sent();
                (0, utils_1.debugError)('❌ [DEBUG] API Error Response:', errorText);
                throw new Error("HTTP error! Status: ".concat(response.status, " - ").concat(errorText));
            case 3: return [4 /*yield*/, response.json()];
            case 4:
                data = _c.sent();
                // Debug: Log response
                (0, utils_1.debugLog)('✅ [DEBUG] Mixer API Response:');
                (0, utils_1.debugLog)('   Success:', data.success);
                (0, utils_1.debugLog)('   Transactions Count:', ((_b = data.transactions) === null || _b === void 0 ? void 0 : _b.length) || 0);
                if (data.transactions && data.transactions.length > 0) {
                    (0, utils_1.debugLog)('   Transaction IDs:', data.transactions.map(function (tx, i) { return "".concat(i + 1, ": ").concat(tx.substring(0, 20), "..."); }));
                }
                if (!data.success) {
                    throw new Error(data.error || 'Failed to get partially signed transactions');
                }
                return [2 /*return*/, data.transactions || []]; // Array of base58 encoded partially signed transactions
            case 5:
                error_1 = _c.sent();
                (0, utils_1.debugError)('Error getting mixer transactions:', error_1);
                throw error_1;
            case 6: return [2 /*return*/];
        }
    });
}); };
/**
 * Validate mixing inputs for single recipient
 */
var validateSingleMixingInputs = function (senderWallet, recipientWallet, senderBalance) {
    // Check if sender wallet is valid
    if (!(0, utils_1.validateWallet)(senderWallet)) {
        return { valid: false, error: 'Invalid sender wallet' };
    }
    // Check if recipient wallet is valid
    if (!(0, utils_1.validateWallet)(recipientWallet)) {
        return { valid: false, error: 'Invalid recipient wallet data' };
    }
    if (!recipientWallet.amount) {
        return { valid: false, error: 'Recipient wallet must have an amount specified' };
    }
    if (!(0, utils_1.validateAmount)(recipientWallet.amount)) {
        return { valid: false, error: 'Invalid amount: ' + recipientWallet.amount };
    }
    return { valid: true };
};
exports.validateSingleMixingInputs = validateSingleMixingInputs;
/**
 * Validate mixing inputs for multiple recipients
 */
var validateMixingInputs = function (senderWallet, recipientWallets, senderBalance) {
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
        var estimatedFee = 0.01 * recipientWallets.length; // Rough estimate for fees in SOL
        if (totalAmount + estimatedFee > senderBalance) {
            return {
                valid: false,
                error: "Insufficient balance. Need at least ".concat(totalAmount + estimatedFee, " SOL, but have ").concat(senderBalance, " SOL")
            };
        }
    }
    return { valid: true };
};
exports.validateMixingInputs = validateMixingInputs;
/**
 * Execute SOL mixing to a single recipient
 */
var mixSOLToSingleRecipient = function (senderWallet, recipientWallet) { return __awaiter(void 0, void 0, void 0, function () {
    var senderAddress, recipientAddress, recipients, mixerTransactions, senderKeypair, recipientKeypairsMap, fullySignedTransactions, mixingBundles, results, i, bundle, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                senderAddress = (0, utils_1.getWalletAddress)(senderWallet.privateKey);
                recipientAddress = (0, utils_1.getWalletAddress)(recipientWallet.privateKey);
                console.log("Preparing to mix ".concat(recipientWallet.amount, " SOL from ").concat(senderAddress, " to ").concat(recipientAddress));
                recipients = [{
                        address: recipientAddress,
                        amount: recipientWallet.amount
                    }];
                return [4 /*yield*/, getMixerTransactions(senderAddress, recipients)];
            case 1:
                mixerTransactions = _a.sent();
                console.log("Received ".concat(mixerTransactions.length, " partially signed transactions from backend"));
                senderKeypair = (0, utils_1.createKeypairFromPrivateKey)(senderWallet.privateKey);
                recipientKeypairsMap = (0, utils_1.createKeypairMap)([recipientWallet]);
                fullySignedTransactions = (0, utils_1.completeTransactionSigning)(mixerTransactions, senderKeypair, recipientKeypairsMap);
                console.log("Completed signing for ".concat(fullySignedTransactions.length, " transactions"));
                mixingBundles = (0, utils_1.prepareTransactionBundles)(fullySignedTransactions);
                console.log("Prepared ".concat(mixingBundles.length, " mixing bundles"));
                results = [];
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < mixingBundles.length)) return [3 /*break*/, 6];
                bundle = mixingBundles[i];
                console.log("Sending bundle ".concat(i + 1, "/").concat(mixingBundles.length, " with ").concat(bundle.transactions.length, " transactions"));
                return [4 /*yield*/, (0, utils_1.sendBundle)(bundle.transactions)];
            case 3:
                result = _a.sent();
                results.push(result);
                if (!(i < mixingBundles.length - 1)) return [3 /*break*/, 5];
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
                console.error('SOL mixing error:', error_2);
                return [2 /*return*/, {
                        success: false,
                        error: error_2 instanceof Error ? error_2.message : 'Unknown error occurred'
                    }];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.mixSOLToSingleRecipient = mixSOLToSingleRecipient;
/**
 * Batch mix SOL to multiple recipients, processing ONE RECIPIENT AT A TIME
 */
var batchMixSOL = function (senderWallet, recipientWallets) { return __awaiter(void 0, void 0, void 0, function () {
    var results, i, recipientWallet, recipientAddress, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                console.log("Starting batch SOL mixing to ".concat(recipientWallets.length, " recipients (1 recipient per batch)"));
                // Return early if no recipients
                if (recipientWallets.length === 0) {
                    return [2 /*return*/, { success: true, results: [] }];
                }
                results = [];
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < recipientWallets.length)) return [3 /*break*/, 5];
                recipientWallet = recipientWallets[i];
                recipientAddress = (0, utils_1.getWalletAddress)(recipientWallet.privateKey);
                console.log("Processing recipient ".concat(i + 1, "/").concat(recipientWallets.length, ": ").concat(recipientAddress, " (").concat(recipientWallet.amount, " SOL)"));
                return [4 /*yield*/, (0, exports.mixSOLToSingleRecipient)(senderWallet, recipientWallet)];
            case 2:
                result = _a.sent();
                if (!result.success) {
                    return [2 /*return*/, {
                            success: false,
                            results: results,
                            error: "Mixing to recipient ".concat(i + 1, " (").concat(recipientAddress, ") failed: ").concat(result.error)
                        }];
                }
                // Add result
                results.push(result.result);
                if (!(i < recipientWallets.length - 1)) return [3 /*break*/, 4];
                console.log("Waiting 3 seconds before processing next recipient...");
                return [4 /*yield*/, (0, utils_1.delay)(3000)];
            case 3:
                _a.sent(); // 3 second delay between recipients
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 1];
            case 5:
                console.log("Successfully completed mixing to all ".concat(recipientWallets.length, " recipients"));
                return [2 /*return*/, {
                        success: true,
                        results: results
                    }];
            case 6:
                error_3 = _a.sent();
                console.error('Batch SOL mixing error:', error_3);
                return [2 /*return*/, {
                        success: false,
                        error: error_3 instanceof Error ? error_3.message : 'Unknown error occurred'
                    }];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.batchMixSOL = batchMixSOL;
