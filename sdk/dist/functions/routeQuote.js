"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRouteQuoteInputs = exports.compareQuotes = exports.getSellQuote = exports.getBuyQuote = exports.getRouteQuote = void 0;
const utils_1 = require("../utils");
// Helper class to enhance the API response
class EnhancedRouteQuote {
    constructor(response) {
        this.success = response.success;
        this.action = response.action;
        this.protocol = response.protocol;
        this.tokenMintAddress = response.tokenMintAddress;
        this.inputAmount = response.inputAmount;
        this.outputAmount = response.outputAmount;
    }
    getOutputAmountAsNumber() {
        return parseFloat(this.outputAmount);
    }
    getExchangeRate() {
        const output = this.getOutputAmountAsNumber();
        return this.inputAmount > 0 ? output / this.inputAmount : 0;
    }
    isBuyOperation() {
        return this.action === 'buy';
    }
    isSellOperation() {
        return this.action === 'sell';
    }
    getSummary() {
        const rate = this.getExchangeRate();
        if (this.isBuyOperation()) {
            return `Buy ${this.inputAmount} SOL → ${this.getOutputAmountAsNumber().toLocaleString()} tokens (Rate: ${rate.toFixed(2)} tokens/SOL) via ${this.protocol}`;
        }
        else {
            return `Sell ${this.inputAmount.toLocaleString()} tokens → ${this.getOutputAmountAsNumber().toLocaleString()} lamports (Rate: ${rate.toFixed(2)} lamports/token) via ${this.protocol}`;
        }
    }
}
/**
 * Get route quote from the API with enhanced result
 */
const getRouteQuote = async (config) => {
    try {
        const sdkConfig = (0, utils_1.getConfig)();
        const baseUrl = sdkConfig.apiUrl?.replace(/\/+$/, '');
        (0, utils_1.debugLog)('🔗 [DEBUG] Getting route quote from:', `${baseUrl}/api/tokens/route`);
        (0, utils_1.debugLog)('📦 [DEBUG] Request payload:', {
            action: config.action,
            tokenMintAddress: config.tokenMintAddress,
            amount: config.amount,
            rpcUrl: config.rpcUrl || sdkConfig.rpcUrl || 'https://api.mainnet-beta.solana.com'
        });
        const response = await fetch(`${baseUrl}/api/tokens/route`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: config.action,
                tokenMintAddress: config.tokenMintAddress,
                amount: config.amount,
                rpcUrl: config.rpcUrl || sdkConfig.rpcUrl || 'https://api.mainnet-beta.solana.com'
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            (0, utils_1.debugError)('❌ [DEBUG] API Error Response:', errorText);
            throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        (0, utils_1.debugLog)('✅ [DEBUG] Route quote API response:', data);
        // Return enhanced result with helper methods
        const enhancedResult = new EnhancedRouteQuote(data);
        return {
            success: true,
            result: enhancedResult
        };
    }
    catch (error) {
        (0, utils_1.debugError)('❌ [DEBUG] Route quote error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
};
exports.getRouteQuote = getRouteQuote;
/**
 * Convenience method to get a buy quote
 */
const getBuyQuote = async (tokenMintAddress, solAmount, rpcUrl) => {
    return (0, exports.getRouteQuote)({
        action: 'buy',
        tokenMintAddress,
        amount: solAmount,
        rpcUrl
    });
};
exports.getBuyQuote = getBuyQuote;
/**
 * Convenience method to get a sell quote
 */
const getSellQuote = async (tokenMintAddress, tokenAmount, rpcUrl) => {
    return (0, exports.getRouteQuote)({
        action: 'sell',
        tokenMintAddress,
        amount: tokenAmount,
        rpcUrl
    });
};
exports.getSellQuote = getSellQuote;
/**
 * Compare buy and sell quotes for the same token
 */
const compareQuotes = async (tokenMintAddress, solAmount, tokenAmount, rpcUrl) => {
    const [buyResult, sellResult] = await Promise.all([
        (0, exports.getBuyQuote)(tokenMintAddress, solAmount, rpcUrl),
        (0, exports.getSellQuote)(tokenMintAddress, tokenAmount, rpcUrl)
    ]);
    const result = {
        buyQuote: buyResult.result,
        sellQuote: sellResult.result,
        buySuccess: buyResult.success,
        sellSuccess: sellResult.success,
        comparison: undefined
    };
    if (buyResult.success && sellResult.success && buyResult.result && sellResult.result) {
        const buyRate = buyResult.result.getExchangeRate();
        const sellRate = sellResult.result.getExchangeRate();
        result.comparison = `Buy: ${buyRate.toFixed(2)} tokens/SOL | Sell: ${sellRate.toFixed(2)} lamports/token`;
    }
    return result;
};
exports.compareQuotes = compareQuotes;
/**
 * Validate route quote inputs
 */
const validateRouteQuoteInputs = (config) => {
    if (!config.tokenMintAddress || config.tokenMintAddress.trim() === '') {
        return { valid: false, error: 'Token mint address is required' };
    }
    if (!config.amount || config.amount <= 0) {
        return { valid: false, error: 'Amount must be greater than 0' };
    }
    if (!['buy', 'sell'].includes(config.action)) {
        return { valid: false, error: 'Action must be either "buy" or "sell"' };
    }
    return { valid: true };
};
exports.validateRouteQuoteInputs = validateRouteQuoteInputs;
//# sourceMappingURL=routeQuote.js.map