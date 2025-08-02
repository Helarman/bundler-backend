"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchTransfer = exports.transferToken = exports.transferSOL = exports.transferTokens = exports.validateTransferInputs = void 0;
const utils_1 = require("../utils");
/**
 * Get transfer transaction from backend
 * The backend will create the transaction based on transfer type (SOL or token)
 */
const getTransferTransaction = async (config) => {
    try {
        const sdkConfig = (0, utils_1.getConfig)();
        const apiUrl = sdkConfig.apiUrl?.replace(/\/+$/, '');
        if (!apiUrl) {
            throw new Error('API URL not configured. Please call configure() with apiUrl first.');
        }
        // Prepare request payload
        const requestPayload = {
            senderPublicKey: config.senderPublicKey,
            receiver: config.receiver,
            tokenAddress: config.tokenAddress,
            amount: config.amount
        };
        // Debug: Log request payload
        (0, utils_1.debugLog)('🔍 [DEBUG] Transfer API Request:');
        (0, utils_1.debugLog)('   URL:', `${apiUrl}/api/tokens/transfer`);
        (0, utils_1.debugLog)('   Payload:', JSON.stringify(requestPayload, null, 2));
        const response = await fetch(`${apiUrl}/api/tokens/transfer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload),
        });
        (0, utils_1.debugLog)('Transfer API request sent, status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            (0, utils_1.debugError)(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Debug: Log response data
        (0, utils_1.debugLog)('Transfer API Response received successfully');
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
        (0, utils_1.debugError)('Error getting transfer transaction:', error);
        throw error;
    }
};
/**
 * Validate transfer inputs
 */
const validateTransferInputs = (senderWallet, receiverAddress, amount, tokenAddress) => {
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
const transferTokens = async (senderWallet, receiverAddress, amount, tokenAddress) => {
    try {
        // Validate inputs
        const validation = (0, exports.validateTransferInputs)(senderWallet, receiverAddress, amount, tokenAddress);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error
            };
        }
        // Derive sender address from private key
        const senderAddress = (0, utils_1.getWalletAddress)(senderWallet.privateKey);
        const transferType = tokenAddress ? 'TOKEN' : 'SOL';
        console.log(`Preparing to transfer ${amount} ${transferType} from ${senderAddress} to ${receiverAddress}`);
        if (tokenAddress) {
            console.log(`Token address: ${tokenAddress}`);
        }
        // Step 1: Get partially prepared transactions from backend
        const transferResult = await getTransferTransaction({
            senderPublicKey: senderAddress,
            receiver: receiverAddress,
            tokenAddress,
            amount
        });
        console.log(`Received ${transferResult.transactions.length} partially prepared transaction(s) from backend`);
        // Step 2: Create keypair from private key
        const senderKeypair = (0, utils_1.createKeypairFromPrivateKey)(senderWallet.privateKey);
        // Step 3: Complete transaction signing
        const fullySignedTransactions = (0, utils_1.completeTransactionSigning)(transferResult.transactions, senderKeypair, new Map() // No additional keypairs needed for simple transfers
        );
        console.log(`Completed signing for ${fullySignedTransactions.length} transactions`);
        // Step 4: Prepare transfer bundles
        const transferBundles = (0, utils_1.prepareTransactionBundles)(fullySignedTransactions);
        console.log(`Prepared ${transferBundles.length} transfer bundles`);
        // Step 5: Send bundles
        const results = [];
        for (let i = 0; i < transferBundles.length; i++) {
            const bundle = transferBundles[i];
            console.log(`Sending bundle ${i + 1}/${transferBundles.length} with ${bundle.transactions.length} transactions`);
            const result = await (0, utils_1.sendBundle)(bundle.transactions);
            results.push(result);
            // Add delay between bundles (except after the last one)
            if (i < transferBundles.length - 1) {
                await (0, utils_1.delay)(500); // 500ms delay
            }
        }
        return {
            success: true,
            result: results
        };
    }
    catch (error) {
        console.error('Transfer error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};
exports.transferTokens = transferTokens;
/**
 * Execute SOL transfer (convenience function)
 */
const transferSOL = async (senderWallet, receiverAddress, amount) => {
    return (0, exports.transferTokens)(senderWallet, receiverAddress, amount);
};
exports.transferSOL = transferSOL;
/**
 * Execute token transfer (convenience function)
 */
const transferToken = async (senderWallet, receiverAddress, amount, tokenAddress) => {
    return (0, exports.transferTokens)(senderWallet, receiverAddress, amount, tokenAddress);
};
exports.transferToken = transferToken;
/**
 * Batch transfer to multiple recipients
 */
const batchTransfer = async (senderWallet, transfers) => {
    try {
        console.log(`Starting batch transfer with ${transfers.length} transfers`);
        // Return early if no transfers
        if (transfers.length === 0) {
            return { success: true, results: [] };
        }
        // Execute each transfer sequentially
        const results = [];
        for (let i = 0; i < transfers.length; i++) {
            const transfer = transfers[i];
            console.log(`Processing transfer ${i + 1}/${transfers.length}`);
            // Execute this transfer
            const transferResult = await (0, exports.transferTokens)(senderWallet, transfer.receiverAddress, transfer.amount, transfer.tokenAddress);
            if (!transferResult.success) {
                return {
                    success: false,
                    results,
                    error: `Transfer ${i + 1} failed: ${transferResult.error}`
                };
            }
            // Add transfer result
            results.push(transferResult.result);
            // Add delay between transfers (except after the last one)
            if (i < transfers.length - 1) {
                await (0, utils_1.delay)(1000); // 1 second delay between transfers
            }
        }
        return {
            success: true,
            results
        };
    }
    catch (error) {
        console.error('Batch transfer error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};
exports.batchTransfer = batchTransfer;
//# sourceMappingURL=transfer.js.map