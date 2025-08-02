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
exports.validateAmount = exports.getWalletAddress = exports.getWalletBalance = exports.validateWallet = exports.delay = exports.prepareTransactionBundles = exports.createKeypairMap = exports.createKeypairFromPrivateKey = exports.completeTransactionSigning = exports.sendBundle = exports.debugError = exports.debugLog = exports.getConfig = exports.configure = void 0;
var web3_js_1 = require("@solana/web3.js");
var bs58_1 = __importDefault(require("bs58"));
// Default configuration
var config = {
    baseUrl: '',
    apiUrl: '',
    debug: false
};
/**
 * Configure the SDK with base URL and other settings
 */
var configure = function (newConfig) {
    config = __assign(__assign({}, config), newConfig);
};
exports.configure = configure;
/**
 * Get the current configuration
 */
var getConfig = function () { return config; };
exports.getConfig = getConfig;
/**
 * Debug logging utility - only logs when debug is enabled
 */
var debugLog = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (config.debug) {
        console.log.apply(console, args);
    }
};
exports.debugLog = debugLog;
/**
 * Debug error logging utility - only logs when debug is enabled
 */
var debugError = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (config.debug) {
        console.error.apply(console, args);
    }
};
exports.debugError = debugError;
/**
 * Send bundle to Jito block engine via backend proxy
 */
var sendBundle = function (encodedBundle) { return __awaiter(void 0, void 0, void 0, function () {
    var apiUrl, response, errorText, data, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                apiUrl = ((_a = (config.apiUrl || config.baseUrl)) === null || _a === void 0 ? void 0 : _a.replace(/\/+$/, '')) || '';
                if (!apiUrl) {
                    throw new Error('API URL not configured. Please call configure() with apiUrl or baseUrl first.');
                }
                // Send to our backend proxy instead of directly to Jito
                (0, exports.debugLog)('🔗 [DEBUG] Sending bundle to:', "".concat(apiUrl, "/api/transactions/send"));
                (0, exports.debugLog)('📦 [DEBUG] Bundle payload:', { transactions: encodedBundle });
                return [4 /*yield*/, fetch("".concat(apiUrl, "/api/transactions/send"), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            transactions: encodedBundle
                        }),
                    })];
            case 1:
                response = _b.sent();
                if (!!response.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, response.text()];
            case 2:
                errorText = _b.sent();
                (0, exports.debugError)('❌ [DEBUG] Send bundle API error:', errorText);
                throw new Error("HTTP error! Status: ".concat(response.status, " - ").concat(errorText));
            case 3: return [4 /*yield*/, response.json()];
            case 4:
                data = _b.sent();
                (0, exports.debugLog)('✅ [DEBUG] Send bundle API response:', data);
                // Handle different response formats
                if (data.result !== undefined) {
                    return [2 /*return*/, data.result];
                }
                else if (data.success !== undefined) {
                    // If the response has success field, return the whole response as result
                    return [2 /*return*/, data];
                }
                else {
                    // Return the data as-is if no specific format
                    return [2 /*return*/, data];
                }
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                (0, exports.debugError)('Error sending bundle:', error_1);
                throw error_1;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.sendBundle = sendBundle;
/**
 * Complete transaction signing with sender and recipient keys
 */
var completeTransactionSigning = function (TransactionsBase58, senderKeypair, recipientKeypairs) {
    try {
        return TransactionsBase58.map(function (txBase58) {
            // Deserialize transaction
            var txBuffer = bs58_1.default.decode(txBase58);
            var transaction = web3_js_1.VersionedTransaction.deserialize(txBuffer);
            // Extract transaction message to determine required signers
            var message = transaction.message;
            var requiredSigners = [];
            // Check which accounts are required signers by examining the transaction message
            // Only add keypairs for accounts that are actually required signers
            var signerKeys = message.staticAccountKeys.slice(0, message.header.numRequiredSignatures);
            for (var _i = 0, signerKeys_1 = signerKeys; _i < signerKeys_1.length; _i++) {
                var accountKey = signerKeys_1[_i];
                var pubkeyStr = accountKey.toBase58();
                if (pubkeyStr === senderKeypair.publicKey.toBase58()) {
                    requiredSigners.push(senderKeypair);
                }
                else if (recipientKeypairs.has(pubkeyStr)) {
                    requiredSigners.push(recipientKeypairs.get(pubkeyStr));
                }
            }
            // If no required signers found, default to sender (this shouldn't happen in normal cases)
            if (requiredSigners.length === 0) {
                requiredSigners.push(senderKeypair);
            }
            // Complete the signing for the transaction
            transaction.sign(requiredSigners);
            // Serialize and encode the fully signed transaction
            return bs58_1.default.encode(transaction.serialize());
        });
    }
    catch (error) {
        console.error('Error completing transaction signing:', error);
        throw error;
    }
};
exports.completeTransactionSigning = completeTransactionSigning;
/**
 * Create keypair from private key string
 */
var createKeypairFromPrivateKey = function (privateKey) {
    return web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(privateKey));
};
exports.createKeypairFromPrivateKey = createKeypairFromPrivateKey;
/**
 * Create a map of public keys to keypairs for efficient lookups
 */
var createKeypairMap = function (wallets) {
    var keypairMap = new Map();
    wallets.forEach(function (wallet) {
        var keypair = (0, exports.createKeypairFromPrivateKey)(wallet.privateKey);
        keypairMap.set(keypair.publicKey.toBase58(), keypair);
    });
    return keypairMap;
};
exports.createKeypairMap = createKeypairMap;
/**
 * Prepare distribution bundles from signed transactions with max 5 transactions per bundle
 */
var prepareTransactionBundles = function (signedTransactions) {
    var MAX_TRANSACTIONS_PER_BUNDLE = 5;
    var bundles = [];
    for (var i = 0; i < signedTransactions.length; i += MAX_TRANSACTIONS_PER_BUNDLE) {
        bundles.push({
            transactions: signedTransactions.slice(i, i + MAX_TRANSACTIONS_PER_BUNDLE)
        });
    }
    return bundles;
};
exports.prepareTransactionBundles = prepareTransactionBundles;
/**
 * Add delay between operations
 */
var delay = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.delay = delay;
/**
 * Validate wallet data
 */
var validateWallet = function (wallet) {
    return !!wallet.privateKey;
};
exports.validateWallet = validateWallet;
/**
 * Get SOL balance for a wallet
 */
var getWalletBalance = function (privateKey, rpcUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, Connection, LAMPORTS_PER_SOL, connection, keypair, balance, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@solana/web3.js')); })];
            case 1:
                _a = _b.sent(), Connection = _a.Connection, LAMPORTS_PER_SOL = _a.LAMPORTS_PER_SOL;
                connection = new Connection(rpcUrl);
                keypair = (0, exports.createKeypairFromPrivateKey)(privateKey);
                return [4 /*yield*/, connection.getBalance(keypair.publicKey)];
            case 2:
                balance = _b.sent();
                return [2 /*return*/, balance / LAMPORTS_PER_SOL];
            case 3:
                error_2 = _b.sent();
                console.error('Error getting wallet balance:', error_2);
                throw error_2;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getWalletBalance = getWalletBalance;
/**
 * Get wallet address from private key
 */
var getWalletAddress = function (privateKey) {
    var keypair = (0, exports.createKeypairFromPrivateKey)(privateKey);
    return keypair.publicKey.toBase58();
};
exports.getWalletAddress = getWalletAddress;
/**
 * Validate amount string
 */
var validateAmount = function (amount) {
    return !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;
};
exports.validateAmount = validateAmount;
