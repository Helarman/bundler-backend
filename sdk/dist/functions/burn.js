"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchBurnToken = exports.burnToken = exports.validateBurnInputs = void 0;
const utils_1 = require("../utils");
/**
 * Get burn transaction from backend
 * The backend will create the transaction for burning tokens
 */
const getBurnTransaction = async (config) => {
    try {
        const sdkConfig = (0, utils_1.getConfig)();
        const apiUrl = sdkConfig.apiUrl?.replace(/\/+$/, '');
        if (!apiUrl) {
            throw new Error('API URL not configured. Please call configure() with apiUrl first.');
        }
        // Prepare request payload
        const requestPayload = {
            walletPublicKey: config.walletPublicKey,
            tokenAddress: config.tokenAddress,
            amount: config.amount
        };
        // Debug: Log request payload
        (0, utils_1.debugLog)('🔍 [DEBUG] Burn API Request:');
        (0, utils_1.debugLog)('   URL:', `${apiUrl}/api/tokens/burn`);
        (0, utils_1.debugLog)('   Payload:', JSON.stringify(requestPayload, null, 2));
        const response = await fetch(`${apiUrl}/api/tokens/burn`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload),
        });
        (0, utils_1.debugLog)('Burn API request sent, status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            (0, utils_1.debugError)(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Debug: Log response data
        (0, utils_1.debugLog)('Burn API Response received successfully');
        (0, utils_1.debugLog)('   Success:', data.success);
        (0, utils_1.debugLog)('   Transactions Count:', data.data?.transactions?.length || 0);
        if (data.error) {
            (0, utils_1.debugLog)('   Error:', data.error);
        }
        if (data.data?.transactions) {
            (0, utils_1.debugLog)('   Transaction IDs:', data.data.transactions.map((tx, i) => `${i + 1}: ${tx.substring(0, 20)}...`));
        }
        if (!data.success) {
            throw new Error(data.error || 'Failed to get partially prepared transactions');
        }
        if (!data.data?.transactions || data.data.transactions.length === 0) {
            throw new Error('No transactions received from API');
        }
        return {
            success: true,
            transactions: data.data.transactions
        };
    }
    catch (error) {
        (0, utils_1.debugError)('Error getting burn transaction:', error);
        throw error;
    }
};
/**
 * Validate burn inputs
 */
const validateBurnInputs = (wallet, tokenAddress, amount) => {
    // Check if wallet is valid
    if (!(0, utils_1.validateWallet)(wallet)) {
        return { valid: false, error: 'Invalid wallet' };
    }
    // Check if token address is provided
    if (!tokenAddress || tokenAddress.trim() === '') {
        return { valid: false, error: 'Token address is required' };
    }
    // Validate token address format (basic Solana address validation)
    if (tokenAddress.length < 32 || tokenAddress.length > 44) {
        return { valid: false, error: 'Invalid token address format' };
    }
    // Check if amount is valid
    if (!(0, utils_1.validateAmount)(amount)) {
        return { valid: false, error: 'Invalid amount: ' + amount };
    }
    return { valid: true };
};
exports.validateBurnInputs = validateBurnInputs;
/**
 * Execute token burn
 */
const burnToken = async (wallet, tokenAddress, amount) => {
    try {
        // Validate inputs
        const validation = (0, exports.validateBurnInputs)(wallet, tokenAddress, amount);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error
            };
        }
        // Derive wallet address from private key
        const walletAddress = (0, utils_1.getWalletAddress)(wallet.privateKey);
        console.log(`Preparing to burn ${amount} tokens from ${walletAddress}`);
        console.log(`Token address: ${tokenAddress}`);
        // Step 1: Get partially prepared transactions from backend
        const burnResult = await getBurnTransaction({
            walletPublicKey: walletAddress,
            tokenAddress,
            amount
        });
        console.log(`Received ${burnResult.transactions.length} partially prepared transaction(s) from backend`);
        // Step 2: Create keypair from private key
        const walletKeypair = (0, utils_1.createKeypairFromPrivateKey)(wallet.privateKey);
        // Step 3: Complete transaction signing
        const fullySignedTransactions = (0, utils_1.completeTransactionSigning)(burnResult.transactions, walletKeypair, new Map() // No additional keypairs needed for burn
        );
        console.log(`Completed signing for ${fullySignedTransactions.length} transactions`);
        // Step 4: Prepare burn bundles
        const burnBundles = (0, utils_1.prepareTransactionBundles)(fullySignedTransactions);
        console.log(`Prepared ${burnBundles.length} burn bundles`);
        // Step 5: Send bundles
        const results = [];
        for (let i = 0; i < burnBundles.length; i++) {
            const bundle = burnBundles[i];
            console.log(`Sending bundle ${i + 1}/${burnBundles.length} with ${bundle.transactions.length} transactions`);
            const result = await (0, utils_1.sendBundle)(bundle.transactions);
            results.push(result);
            // Add delay between bundles (except after the last one)
            if (i < burnBundles.length - 1) {
                await (0, utils_1.delay)(500); // 500ms delay
            }
        }
        return {
            success: true,
            result: results
        };
    }
    catch (error) {
        console.error('Burn error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};
exports.burnToken = burnToken;
/**
 * Batch burn tokens
 */
const batchBurnToken = async (wallet, burns) => {
    try {
        console.log(`Starting batch burn with ${burns.length} burns`);
        // Return early if no burns
        if (burns.length === 0) {
            return { success: true, results: [] };
        }
        // Execute each burn sequentially
        const results = [];
        for (let i = 0; i < burns.length; i++) {
            const burn = burns[i];
            console.log(`Processing burn ${i + 1}/${burns.length}`);
            // Execute this burn
            const burnResult = await (0, exports.burnToken)(wallet, burn.tokenAddress, burn.amount);
            if (!burnResult.success) {
                return {
                    success: false,
                    results,
                    error: `Burn ${i + 1} failed: ${burnResult.error}`
                };
            }
            // Add burn result
            results.push(burnResult.result);
            // Add delay between burns (except after the last one)
            if (i < burns.length - 1) {
                await (0, utils_1.delay)(1000); // 1 second delay between burns
            }
        }
        return {
            success: true,
            results
        };
    }
    catch (error) {
        console.error('Batch burn error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};
exports.batchBurnToken = batchBurnToken;
//# sourceMappingURL=burn.js.map