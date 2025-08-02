"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTokenBuyInputs = exports.buyTokenBatch = exports.buyTokenSingle = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const utils_1 = require("../utils");
// Constants
const MAX_BUNDLES_PER_SECOND = 2;
// Rate limiting state
const rateLimitState = {
    count: 0,
    lastReset: Date.now(),
    maxBundlesPerSecond: MAX_BUNDLES_PER_SECOND
};
/**
 * Check rate limit and wait if necessary
 */
const checkRateLimit = async () => {
    const now = Date.now();
    if (now - rateLimitState.lastReset >= 1000) {
        rateLimitState.count = 0;
        rateLimitState.lastReset = now;
    }
    if (rateLimitState.count >= rateLimitState.maxBundlesPerSecond) {
        const waitTime = 1000 - (now - rateLimitState.lastReset);
        await (0, utils_1.delay)(waitTime);
        rateLimitState.count = 0;
        rateLimitState.lastReset = Date.now();
    }
    rateLimitState.count++;
};
/**
 * Get partially prepared transactions from backend
 */
const getTokenBuyTransactions = async (walletAddresses, tokenConfig, customAmounts) => {
    try {
        const config = (0, utils_1.getConfig)();
        const baseUrl = config.apiUrl?.replace(/\/+$/, '');
        (0, utils_1.debugLog)('🔗 [DEBUG] Getting token buy transactions from:', `${baseUrl}/api/tokens/buy`);
        (0, utils_1.debugLog)('📦 [DEBUG] Request payload:', {
            walletAddresses,
            tokenAddress: tokenConfig.tokenAddress,
            protocol: tokenConfig.protocol,
            solAmount: tokenConfig.solAmount,
            amounts: customAmounts,
            slippageBps: tokenConfig.slippageBps || 100,
            jitoTipLamports: tokenConfig.jitoTipLamports || 5000
        });
        const response = await fetch(`${baseUrl}/api/tokens/buy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                walletAddresses,
                tokenAddress: tokenConfig.tokenAddress,
                protocol: tokenConfig.protocol,
                solAmount: tokenConfig.solAmount,
                amounts: customAmounts, // Optional custom amounts per wallet
                slippageBps: tokenConfig.slippageBps || 100, // Default 1% slippage
                jitoTipLamports: tokenConfig.jitoTipLamports || 5000 // Default tip
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            (0, utils_1.debugError)('❌ [DEBUG] API Error Response:', errorText);
            throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        (0, utils_1.debugLog)('✅ [DEBUG] Token buy API response:', data);
        if (!data.success) {
            throw new Error(data.error || 'Failed to get token buy transactions');
        }
        // Handle different response formats
        if (data.bundles && Array.isArray(data.bundles)) {
            return data.bundles.map((bundle) => Array.isArray(bundle) ? { transactions: bundle } : bundle);
        }
        else if (data.transactions && Array.isArray(data.transactions)) {
            // Split transactions into multiple bundles if more than 5 transactions
            const transactions = data.transactions;
            const maxTransactionsPerBundle = 5;
            const bundles = [];
            for (let i = 0; i < transactions.length; i += maxTransactionsPerBundle) {
                const chunk = transactions.slice(i, i + maxTransactionsPerBundle);
                bundles.push({ transactions: chunk });
            }
            console.log(`📦 Split ${transactions.length} transactions into ${bundles.length} bundles (max ${maxTransactionsPerBundle} per bundle)`);
            return bundles;
        }
        else if (Array.isArray(data)) {
            // Split array data into multiple bundles if more than 5 transactions
            const transactions = data;
            const maxTransactionsPerBundle = 5;
            const bundles = [];
            for (let i = 0; i < transactions.length; i += maxTransactionsPerBundle) {
                const chunk = transactions.slice(i, i + maxTransactionsPerBundle);
                bundles.push({ transactions: chunk });
            }
            console.log(`📦 Split ${transactions.length} transactions into ${bundles.length} bundles (max ${maxTransactionsPerBundle} per bundle)`);
            return bundles;
        }
        else {
            throw new Error('No transactions returned from backend');
        }
    }
    catch (error) {
        (0, utils_1.debugError)('Error getting token buy transactions:', error);
        throw error;
    }
};
/**
 * Complete bundle signing with wallet keypairs using utils function
 */
const completeBundleSigning = (bundle, walletKeypairs) => {
    if (!bundle.transactions || !Array.isArray(bundle.transactions)) {
        console.error("Invalid bundle format, transactions property is missing or not an array:", bundle);
        return { transactions: [] };
    }
    // Create a map of public keys to keypairs for the utils function
    const keypairMap = new Map();
    walletKeypairs.forEach(kp => {
        keypairMap.set(kp.publicKey.toBase58(), kp);
    });
    // Use the first keypair as sender (primary signer)
    const senderKeypair = walletKeypairs[0];
    // Use completeTransactionSigning from utils
    const signedTransactions = (0, utils_1.completeTransactionSigning)(bundle.transactions, senderKeypair, keypairMap);
    return { transactions: signedTransactions };
};
/**
 * Execute token buy operation for a single wallet
 */
const buyTokenSingle = async (wallet, tokenConfig) => {
    try {
        console.log(`🚀 Starting single token buy for ${tokenConfig.protocol} protocol`);
        console.log(`📝 Token: ${tokenConfig.tokenAddress}`);
        console.log(`💰 Amount: ${tokenConfig.solAmount} SOL`);
        // Validate inputs
        const validation = (0, exports.validateTokenBuyInputs)([wallet], tokenConfig);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error
            };
        }
        // Get wallet address from private key
        const keypair = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(wallet.privateKey));
        const walletAddress = keypair.publicKey.toBase58();
        // Step 1: Get partially prepared transactions from backend
        const partiallyPreparedBundles = await getTokenBuyTransactions([walletAddress], tokenConfig);
        console.log(`📦 Received ${partiallyPreparedBundles.length} bundles from backend`);
        // Step 2: Complete transaction signing
        const signedBundles = partiallyPreparedBundles.map(bundle => completeBundleSigning(bundle, [keypair]));
        console.log(`✍️  Completed signing for ${signedBundles.length} bundles`);
        // Step 3: Send bundles with rate limiting
        const results = [];
        for (let i = 0; i < signedBundles.length; i++) {
            const bundle = signedBundles[i];
            console.log(`📤 Sending bundle ${i + 1}/${signedBundles.length} with ${bundle.transactions.length} transactions`);
            await checkRateLimit();
            const result = await (0, utils_1.sendBundle)(bundle.transactions);
            results.push(result);
            // Add delay between bundles (except after the last one)
            if (i < signedBundles.length - 1) {
                await (0, utils_1.delay)(500);
            }
        }
        console.log(`✅ Successfully completed token buy operation`);
        return {
            success: true,
            result: results
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Token buy error:', errorMessage);
        return {
            success: false,
            error: errorMessage
        };
    }
};
exports.buyTokenSingle = buyTokenSingle;
/**
 * Execute token buy operation for multiple wallets (batch)
 */
const buyTokenBatch = async (wallets, tokenConfig, customAmounts) => {
    try {
        console.log(`🚀 Starting batch token buy for ${tokenConfig.protocol} protocol`);
        console.log(`📝 Token: ${tokenConfig.tokenAddress}`);
        console.log(`👥 Wallets: ${wallets.length}`);
        console.log(`💰 Amount: ${tokenConfig.solAmount} SOL per wallet`);
        // Validate inputs
        const validation = (0, exports.validateTokenBuyInputs)(wallets, tokenConfig);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error
            };
        }
        // Create keypairs and extract addresses
        const walletKeypairs = wallets.map(wallet => web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(wallet.privateKey)));
        const walletAddresses = walletKeypairs.map(kp => kp.publicKey.toBase58());
        // Step 1: Get partially prepared transactions from backend
        const partiallyPreparedBundles = await getTokenBuyTransactions(walletAddresses, tokenConfig, customAmounts);
        console.log(`📦 Received ${partiallyPreparedBundles.length} bundles from backend`);
        // Step 2: Complete transaction signing
        const signedBundles = partiallyPreparedBundles.map(bundle => completeBundleSigning(bundle, walletKeypairs));
        console.log(`✍️  Completed signing for ${signedBundles.length} bundles`);
        // Step 3: Send bundles with rate limiting
        const results = [];
        for (let i = 0; i < signedBundles.length; i++) {
            const bundle = signedBundles[i];
            console.log(`📤 Sending bundle ${i + 1}/${signedBundles.length} with ${bundle.transactions.length} transactions`);
            await checkRateLimit();
            const result = await (0, utils_1.sendBundle)(bundle.transactions);
            results.push([result]); // Wrap in array for consistency
            // Add delay between bundles (except after the last one)
            if (i < signedBundles.length - 1) {
                await (0, utils_1.delay)(500);
            }
        }
        console.log(`✅ Successfully completed batch token buy operation`);
        return {
            success: true,
            result: results
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Batch token buy error:', errorMessage);
        return {
            success: false,
            error: errorMessage
        };
    }
};
exports.buyTokenBatch = buyTokenBatch;
/**
 * Validate token buy inputs
 */
const validateTokenBuyInputs = (wallets, tokenConfig) => {
    // Check if token config is valid
    if (!tokenConfig.tokenAddress) {
        return { valid: false, error: 'Invalid token address' };
    }
    if (!(0, utils_1.validateAmount)(tokenConfig.solAmount.toString())) {
        return { valid: false, error: 'Invalid SOL amount' };
    }
    // Validate protocol
    const supportedProtocols = ['pumpfun', 'moonshot', 'launchpad', 'raydium', 'pumpswap', 'jupiter', 'boopfun'];
    if (!supportedProtocols.includes(tokenConfig.protocol)) {
        return { valid: false, error: `Unsupported protocol: ${tokenConfig.protocol}. Supported: ${supportedProtocols.join(', ')}` };
    }
    // Check if wallets are valid
    if (!wallets.length) {
        return { valid: false, error: 'No wallets provided' };
    }
    for (const wallet of wallets) {
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
exports.validateTokenBuyInputs = validateTokenBuyInputs;
//# sourceMappingURL=tokenBuy.js.map