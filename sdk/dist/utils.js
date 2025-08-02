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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAmount = exports.getWalletAddress = exports.getWalletBalance = exports.validateWallet = exports.delay = exports.prepareTransactionBundles = exports.createKeypairMap = exports.createKeypairFromPrivateKey = exports.completeTransactionSigning = exports.sendBundle = exports.debugError = exports.debugLog = exports.getConfig = exports.configure = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
// Default configuration
let config = {
    baseUrl: '',
    apiUrl: '',
    debug: false
};
/**
 * Configure the SDK with base URL and other settings
 */
const configure = (newConfig) => {
    config = { ...config, ...newConfig };
};
exports.configure = configure;
/**
 * Get the current configuration
 */
const getConfig = () => config;
exports.getConfig = getConfig;
/**
 * Debug logging utility - only logs when debug is enabled
 */
const debugLog = (...args) => {
    if (config.debug) {
        console.log(...args);
    }
};
exports.debugLog = debugLog;
/**
 * Debug error logging utility - only logs when debug is enabled
 */
const debugError = (...args) => {
    if (config.debug) {
        console.error(...args);
    }
};
exports.debugError = debugError;
/**
 * Send bundle to Jito block engine via backend proxy
 */
const sendBundle = async (encodedBundle) => {
    try {
        // Use apiUrl if available, fallback to baseUrl for backward compatibility
        const apiUrl = (config.apiUrl || config.baseUrl)?.replace(/\/+$/, '') || '';
        if (!apiUrl) {
            throw new Error('API URL not configured. Please call configure() with apiUrl or baseUrl first.');
        }
        // Send to our backend proxy instead of directly to Jito
        (0, exports.debugLog)('🔗 [DEBUG] Sending bundle to:', `${apiUrl}/api/transactions/send`);
        (0, exports.debugLog)('📦 [DEBUG] Bundle payload:', { transactions: encodedBundle });
        const response = await fetch(`${apiUrl}/api/transactions/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                transactions: encodedBundle
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            (0, exports.debugError)('❌ [DEBUG] Send bundle API error:', errorText);
            throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        (0, exports.debugLog)('✅ [DEBUG] Send bundle API response:', data);
        // Handle different response formats
        if (data.result !== undefined) {
            return data.result;
        }
        else if (data.success !== undefined) {
            // If the response has success field, return the whole response as result
            return data;
        }
        else {
            // Return the data as-is if no specific format
            return data;
        }
    }
    catch (error) {
        (0, exports.debugError)('Error sending bundle:', error);
        throw error;
    }
};
exports.sendBundle = sendBundle;
/**
 * Complete transaction signing with sender and recipient keys
 */
const completeTransactionSigning = (TransactionsBase58, senderKeypair, recipientKeypairs) => {
    try {
        return TransactionsBase58.map(txBase58 => {
            // Deserialize transaction
            const txBuffer = bs58_1.default.decode(txBase58);
            const transaction = web3_js_1.VersionedTransaction.deserialize(txBuffer);
            // Extract transaction message to determine required signers
            const message = transaction.message;
            const requiredSigners = [];
            // Check which accounts are required signers by examining the transaction message
            // Only add keypairs for accounts that are actually required signers
            const signerKeys = message.staticAccountKeys.slice(0, message.header.numRequiredSignatures);
            for (const accountKey of signerKeys) {
                const pubkeyStr = accountKey.toBase58();
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
const createKeypairFromPrivateKey = (privateKey) => {
    return web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(privateKey));
};
exports.createKeypairFromPrivateKey = createKeypairFromPrivateKey;
/**
 * Create a map of public keys to keypairs for efficient lookups
 */
const createKeypairMap = (wallets) => {
    const keypairMap = new Map();
    wallets.forEach(wallet => {
        const keypair = (0, exports.createKeypairFromPrivateKey)(wallet.privateKey);
        keypairMap.set(keypair.publicKey.toBase58(), keypair);
    });
    return keypairMap;
};
exports.createKeypairMap = createKeypairMap;
/**
 * Prepare distribution bundles from signed transactions with max 5 transactions per bundle
 */
const prepareTransactionBundles = (signedTransactions) => {
    const MAX_TRANSACTIONS_PER_BUNDLE = 5;
    const bundles = [];
    for (let i = 0; i < signedTransactions.length; i += MAX_TRANSACTIONS_PER_BUNDLE) {
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
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.delay = delay;
/**
 * Validate wallet data
 */
const validateWallet = (wallet) => {
    return !!wallet.privateKey;
};
exports.validateWallet = validateWallet;
/**
 * Get SOL balance for a wallet
 */
const getWalletBalance = async (privateKey, rpcUrl) => {
    try {
        const { Connection, LAMPORTS_PER_SOL } = await Promise.resolve().then(() => __importStar(require('@solana/web3.js')));
        const connection = new Connection(rpcUrl);
        const keypair = (0, exports.createKeypairFromPrivateKey)(privateKey);
        const balance = await connection.getBalance(keypair.publicKey);
        return balance / LAMPORTS_PER_SOL;
    }
    catch (error) {
        console.error('Error getting wallet balance:', error);
        throw error;
    }
};
exports.getWalletBalance = getWalletBalance;
/**
 * Get wallet address from private key
 */
const getWalletAddress = (privateKey) => {
    const keypair = (0, exports.createKeypairFromPrivateKey)(privateKey);
    return keypair.publicKey.toBase58();
};
exports.getWalletAddress = getWalletAddress;
/**
 * Validate amount string
 */
const validateAmount = (amount) => {
    return !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;
};
exports.validateAmount = validateAmount;
//# sourceMappingURL=utils.js.map