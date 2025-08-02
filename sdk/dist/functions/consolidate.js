"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consolidateSOL = exports.validateConsolidationInputs = void 0;
const utils_1 = require("../utils");
/**
 * Get partially prepared consolidation transactions from backend
 * The backend will create transactions without signing them
 */
const getConsolidateTransactions = async (sourceAddresses, receiverAddress, percentage) => {
    try {
        const config = (0, utils_1.getConfig)();
        // Use apiUrl if available, fallback to baseUrl for backward compatibility
        const apiUrl = (config.apiUrl)?.replace(/\/+$/, '');
        if (!apiUrl) {
            throw new Error('API URL not configured. Please call configure() with apiUrl or baseUrl first.');
        }
        // Prepare request payload
        const requestPayload = {
            sourceAddresses,
            receiverAddress,
            percentage
        };
        // Debug: Log request payload
        (0, utils_1.debugLog)('🔍 [DEBUG] Consolidate API Request:');
        (0, utils_1.debugLog)('   URL:', `${apiUrl}/api/wallets/consolidate`);
        (0, utils_1.debugLog)('   Payload:', JSON.stringify(requestPayload, null, 2));
        const response = await fetch(`${apiUrl}/api/wallets/consolidate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload),
        });
        if (!response.ok) {
            (0, utils_1.debugLog)('❌ [DEBUG] HTTP Error Response:');
            (0, utils_1.debugLog)('   Status:', response.status);
            (0, utils_1.debugLog)('   Status Text:', response.statusText);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Debug: Log response data
        (0, utils_1.debugLog)('✅ [DEBUG] Consolidate API Response:');
        (0, utils_1.debugLog)('   Success:', data.success);
        (0, utils_1.debugLog)('   Transactions Count:', data.transactions?.length || 0);
        if (data.error) {
            (0, utils_1.debugLog)('   Error:', data.error);
        }
        if (data.transactions) {
            (0, utils_1.debugLog)('   Transaction IDs:', data.transactions.map((tx, i) => `${i + 1}: ${tx.substring(0, 20)}...`));
        }
        if (!data.success) {
            throw new Error(data.error || 'Failed to get partially prepared transactions');
        }
        return data.transactions || []; // Array of base58 encoded partially prepared transactions
    }
    catch (error) {
        (0, utils_1.debugError)('Error getting partially prepared transactions:', error);
        throw error;
    }
};
/**
 * Validate consolidation inputs
 */
const validateConsolidationInputs = (sourceWallets, receiverWallet, percentage, sourceBalances) => {
    // Check if receiver wallet is valid
    if (!(0, utils_1.validateWallet)(receiverWallet)) {
        return { valid: false, error: 'Invalid receiver wallet' };
    }
    // Check if source wallets are valid
    if (!sourceWallets.length) {
        return { valid: false, error: 'No source wallets' };
    }
    for (const wallet of sourceWallets) {
        if (!(0, utils_1.validateWallet)(wallet)) {
            return { valid: false, error: 'Invalid source wallet data' };
        }
        // Check balance if provided
        if (sourceBalances) {
            const address = (0, utils_1.getWalletAddress)(wallet.privateKey);
            const balance = sourceBalances.get(address) || 0;
            if (balance <= 0) {
                return { valid: false, error: `Source wallet ${address.substring(0, 6)}... has no balance` };
            }
        }
    }
    // Check if percentage is valid
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
        return { valid: false, error: 'Percentage must be between 1 and 100' };
    }
    return { valid: true };
};
exports.validateConsolidationInputs = validateConsolidationInputs;
/**
 * Execute SOL consolidation
 */
const consolidateSOL = async (sourceWallets, receiverWallet, percentage) => {
    try {
        // Derive addresses from private keys
        const receiverAddress = (0, utils_1.getWalletAddress)(receiverWallet.privateKey);
        const sourceAddresses = sourceWallets.map(wallet => (0, utils_1.getWalletAddress)(wallet.privateKey));
        console.log(`Preparing to consolidate ${percentage}% of SOL from ${sourceWallets.length} wallets to ${receiverAddress}`);
        // Step 1: Get partially prepared transactions from backend
        const partiallyPreparedTransactions = await getConsolidateTransactions(sourceAddresses, receiverAddress, percentage);
        console.log(`Received ${partiallyPreparedTransactions.length} partially prepared transactions from backend`);
        // Step 2: Create keypairs from private keys
        const receiverKeypair = (0, utils_1.createKeypairFromPrivateKey)(receiverWallet.privateKey);
        // Create a map of source public keys to keypairs for faster lookups
        const sourceKeypairsMap = (0, utils_1.createKeypairMap)(sourceWallets);
        // Step 3: Complete transaction signing with source and receiver keys
        const fullySignedTransactions = (0, utils_1.completeTransactionSigning)(partiallyPreparedTransactions, receiverKeypair, sourceKeypairsMap);
        console.log(`Completed signing for ${fullySignedTransactions.length} transactions`);
        // Step 4: Prepare consolidation bundles
        const consolidationBundles = (0, utils_1.prepareTransactionBundles)(fullySignedTransactions);
        console.log(`Prepared ${consolidationBundles.length} consolidation bundles`);
        // Step 5: Send bundles
        const results = [];
        for (let i = 0; i < consolidationBundles.length; i++) {
            const bundle = consolidationBundles[i];
            console.log(`Sending bundle ${i + 1}/${consolidationBundles.length} with ${bundle.transactions.length} transactions`);
            const result = await (0, utils_1.sendBundle)(bundle.transactions);
            results.push(result);
            // Add delay between bundles (except after the last one)
            if (i < consolidationBundles.length - 1) {
                await (0, utils_1.delay)(500); // 500ms delay
            }
        }
        return {
            success: true,
            result: results
        };
    }
    catch (error) {
        console.error('SOL consolidation error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};
exports.consolidateSOL = consolidateSOL;
//# sourceMappingURL=consolidate.js.map