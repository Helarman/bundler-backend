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
exports.batchTransfer = exports.transferToken = exports.transferSOL = exports.transferTokens = exports.validateTransferInputs = void 0;
var utils_1 = require("../utils");
/**
 * Get transfer transaction from backend
 * The backend will create the transaction based on transfer type (SOL or token)
 */
var getTransferTransaction = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var sdkConfig, apiUrl, requestPayload, response, errorText, data, error_1;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 5, , 6]);
                sdkConfig = (0, utils_1.getConfig)();
                apiUrl = (_a = sdkConfig.apiUrl) === null || _a === void 0 ? void 0 : _a.replace(/\/+$/, '');
                if (!apiUrl) {
                    throw new Error('API URL not configured. Please call configure() with apiUrl first.');
                }
                requestPayload = {
                    senderPublicKey: config.senderPublicKey,
                    receiver: config.receiver,
                    tokenAddress: config.tokenAddress,
                    amount: config.amount
                };
                // Debug: Log request payload
                (0, utils_1.debugLog)('🔍 [DEBUG] Transfer API Request:');
                (0, utils_1.debugLog)('   URL:', "".concat(apiUrl, "/api/tokens/transfer"));
                (0, utils_1.debugLog)('   Payload:', JSON.stringify(requestPayload, null, 2));
                return [4 /*yield*/, fetch("".concat(apiUrl, "/api/tokens/transfer"), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestPayload),
                    })];
            case 1:
                response = _f.sent();
                (0, utils_1.debugLog)('Transfer API request sent, status:', response.status);
                if (!!response.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, response.text()];
            case 2:
                errorText = _f.sent();
                (0, utils_1.debugError)("HTTP error! Status: ".concat(response.status, ", Body: ").concat(errorText));
                throw new Error("HTTP error! Status: ".concat(response.status));
            case 3: return [4 /*yield*/, response.json()];
            case 4:
                data = _f.sent();
                // Debug: Log response data
                (0, utils_1.debugLog)('Transfer API Response received successfully');
                (0, utils_1.debugLog)('   Success:', data.success);
                (0, utils_1.debugLog)('   Transactions Count:', ((_c = (_b = data.data) === null || _b === void 0 ? void 0 : _b.transactions) === null || _c === void 0 ? void 0 : _c.length) || 0);
                if (data.error) {
                    (0, utils_1.debugLog)('   Error:', data.error);
                }
                if ((_d = data.data) === null || _d === void 0 ? void 0 : _d.transactions) {
                    (0, utils_1.debugLog)('   Transaction IDs:', data.data.transactions.map(function (tx, i) { return "".concat(i + 1, ": ").concat(tx.substring(0, 20), "..."); }));
                }
                if (!data.success) {
                    throw new Error(data.error || 'Failed to get partially prepared transactions');
                }
                if (!((_e = data.data) === null || _e === void 0 ? void 0 : _e.transactions) || data.data.transactions.length === 0) {
                    throw new Error('No transactions received from API');
                }
                return [2 /*return*/, {
                        success: true,
                        transactions: data.data.transactions
                    }];
            case 5:
                error_1 = _f.sent();
                (0, utils_1.debugError)('Error getting transfer transaction:', error_1);
                throw error_1;
            case 6: return [2 /*return*/];
        }
    });
}); };
/**
 * Validate transfer inputs
 */
var validateTransferInputs = function (senderWallet, receiverAddress, amount, tokenAddress) {
    // Check if sender wallet is valid
    if (!(0, utils_1.validateWallet)(senderWallet)) {
        return { valid: false, error: 'Invalid sender wallet' };
    }
    // Check if receiver address is provided
    if (!receiverAddress || receiverAddress.trim() === '') {
        return { valid: false, error: 'Receiver address is required' };
    }
    // Validate receiver address format (basic Solana address validation)
    if (receiverAddress.length < 32 || receiverAddress.length > 44) {
        return { valid: false, error: 'Invalid receiver address format' };
    }
    // Check if amount is valid
    if (!(0, utils_1.validateAmount)(amount)) {
        return { valid: false, error: 'Invalid amount: ' + amount };
    }
    // If token address is provided, validate it
    if (tokenAddress && (tokenAddress.length < 32 || tokenAddress.length > 44)) {
        return { valid: false, error: 'Invalid token address format' };
    }
    return { valid: true };
};
exports.validateTransferInputs = validateTransferInputs;
/**
 * Execute SOL or token transfer
 */
var transferTokens = function (senderWallet, receiverAddress, amount, tokenAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var validation, senderAddress, transferType, transferResult, senderKeypair, fullySignedTransactions, transferBundles, results, i, bundle, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                validation = (0, exports.validateTransferInputs)(senderWallet, receiverAddress, amount, tokenAddress);
                if (!validation.valid) {
                    return [2 /*return*/, {
                            success: false,
                            error: validation.error
                        }];
                }
                senderAddress = (0, utils_1.getWalletAddress)(senderWallet.privateKey);
                transferType = tokenAddress ? 'TOKEN' : 'SOL';
                console.log("Preparing to transfer ".concat(amount, " ").concat(transferType, " from ").concat(senderAddress, " to ").concat(receiverAddress));
                if (tokenAddress) {
                    console.log("Token address: ".concat(tokenAddress));
                }
                return [4 /*yield*/, getTransferTransaction({
                        senderPublicKey: senderAddress,
                        receiver: receiverAddress,
                        tokenAddress: tokenAddress,
                        amount: amount
                    })];
            case 1:
                transferResult = _a.sent();
                console.log("Received ".concat(transferResult.transactions.length, " partially prepared transaction(s) from backend"));
                senderKeypair = (0, utils_1.createKeypairFromPrivateKey)(senderWallet.privateKey);
                fullySignedTransactions = (0, utils_1.completeTransactionSigning)(transferResult.transactions, senderKeypair, new Map() // No additional keypairs needed for simple transfers
                );
                console.log("Completed signing for ".concat(fullySignedTransactions.length, " transactions"));
                transferBundles = (0, utils_1.prepareTransactionBundles)(fullySignedTransactions);
                console.log("Prepared ".concat(transferBundles.length, " transfer bundles"));
                results = [];
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < transferBundles.length)) return [3 /*break*/, 6];
                bundle = transferBundles[i];
                console.log("Sending bundle ".concat(i + 1, "/").concat(transferBundles.length, " with ").concat(bundle.transactions.length, " transactions"));
                return [4 /*yield*/, (0, utils_1.sendBundle)(bundle.transactions)];
            case 3:
                result = _a.sent();
                results.push(result);
                if (!(i < transferBundles.length - 1)) return [3 /*break*/, 5];
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
                console.error('Transfer error:', error_2);
                return [2 /*return*/, {
                        success: false,
                        error: error_2 instanceof Error ? error_2.message : 'Unknown error'
                    }];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.transferTokens = transferTokens;
/**
 * Execute SOL transfer (convenience function)
 */
var transferSOL = function (senderWallet, receiverAddress, amount) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (0, exports.transferTokens)(senderWallet, receiverAddress, amount)];
    });
}); };
exports.transferSOL = transferSOL;
/**
 * Execute token transfer (convenience function)
 */
var transferToken = function (senderWallet, receiverAddress, amount, tokenAddress) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (0, exports.transferTokens)(senderWallet, receiverAddress, amount, tokenAddress)];
    });
}); };
exports.transferToken = transferToken;
/**
 * Batch transfer to multiple recipients
 */
var batchTransfer = function (senderWallet, transfers) { return __awaiter(void 0, void 0, void 0, function () {
    var results, i, transfer, transferResult, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                console.log("Starting batch transfer with ".concat(transfers.length, " transfers"));
                // Return early if no transfers
                if (transfers.length === 0) {
                    return [2 /*return*/, { success: true, results: [] }];
                }
                results = [];
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < transfers.length)) return [3 /*break*/, 5];
                transfer = transfers[i];
                console.log("Processing transfer ".concat(i + 1, "/").concat(transfers.length));
                return [4 /*yield*/, (0, exports.transferTokens)(senderWallet, transfer.receiverAddress, transfer.amount, transfer.tokenAddress)];
            case 2:
                transferResult = _a.sent();
                if (!transferResult.success) {
                    return [2 /*return*/, {
                            success: false,
                            results: results,
                            error: "Transfer ".concat(i + 1, " failed: ").concat(transferResult.error)
                        }];
                }
                // Add transfer result
                results.push(transferResult.result);
                if (!(i < transfers.length - 1)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, utils_1.delay)(1000)];
            case 3:
                _a.sent(); // 1 second delay between transfers
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/, {
                    success: true,
                    results: results
                }];
            case 6:
                error_3 = _a.sent();
                console.error('Batch transfer error:', error_3);
                return [2 /*return*/, {
                        success: false,
                        error: error_3 instanceof Error ? error_3.message : 'Unknown error'
                    }];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.batchTransfer = batchTransfer;
