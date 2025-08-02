"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JetonSDK = void 0;
const utils_1 = require("./utils");
const distribute_1 = require("./functions/distribute");
const mixer_1 = require("./functions/mixer");
const tokenBuy_1 = require("./functions/tokenBuy");
const tokenSell_1 = require("./functions/tokenSell");
const consolidate_1 = require("./functions/consolidate");
const routeQuote_1 = require("./functions/routeQuote");
const transfer_1 = require("./functions/transfer");
const create_1 = require("./functions/create");
const burn_1 = require("./functions/burn");
/**
 * Main JetonSDK class providing access to all Solana transaction operations
 */
class JetonSDK {
    /**
     * Initialize the SDK with configuration
     */
    constructor(config) {
        (0, utils_1.configure)(config);
    }
    /**
     * Update SDK configuration
     */
    configure(config) {
        (0, utils_1.configure)(config);
    }
    /**
     * Get current SDK configuration
     */
    getConfig() {
        return (0, utils_1.getConfig)();
    }
    /**
     * Validate distribution inputs before executing
     */
    validateDistribution(senderWallet, recipientWallets, senderBalance) {
        return (0, distribute_1.validateDistributionInputs)(senderWallet, recipientWallets, senderBalance);
    }
    /**
     * Distribute SOL to multiple recipients
     */
    async distributeSOL(senderWallet, recipientWallets) {
        return (0, distribute_1.distributeSOL)(senderWallet, recipientWallets);
    }
    /**
     * Batch distribute SOL to multiple recipients with automatic batching
     */
    async batchDistributeSOL(senderWallet, recipientWallets) {
        return (0, distribute_1.batchDistributeSOL)(senderWallet, recipientWallets);
    }
    /**
     * Validate mixing inputs before executing
     */
    validateMixing(senderWallet, recipientWallets, senderBalance) {
        return (0, mixer_1.validateMixingInputs)(senderWallet, recipientWallets, senderBalance);
    }
    /**
     * Validate single recipient mixing inputs before executing
     */
    validateSingleMixing(senderWallet, recipientWallet, senderBalance) {
        return (0, mixer_1.validateSingleMixingInputs)(senderWallet, recipientWallet, senderBalance);
    }
    /**
     * Mix SOL to a single recipient (optimized)
     */
    async mixSOLToSingleRecipient(senderWallet, recipientWallet) {
        return (0, mixer_1.mixSOLToSingleRecipient)(senderWallet, recipientWallet);
    }
    /**
     * Batch mix SOL to multiple recipients, processing one recipient at a time
     */
    async batchMixSOL(senderWallet, recipientWallets) {
        return (0, mixer_1.batchMixSOL)(senderWallet, recipientWallets);
    }
    /**
     * Validate token buy inputs before executing
     */
    validateTokenBuy(wallets, tokenConfig) {
        return (0, tokenBuy_1.validateTokenBuyInputs)(wallets, tokenConfig);
    }
    /**
     * Buy tokens for a single wallet
     */
    async buyTokenSingle(wallet, tokenConfig) {
        return (0, tokenBuy_1.buyTokenSingle)(wallet, tokenConfig);
    }
    /**
     * Buy tokens for multiple wallets (batch)
     */
    async buyTokenBatch(wallets, tokenConfig, customAmounts) {
        return (0, tokenBuy_1.buyTokenBatch)(wallets, tokenConfig, customAmounts);
    }
    /**
     * Validate token sell inputs before executing
     */
    validateTokenSell(wallets, tokenConfig) {
        return (0, tokenSell_1.validateTokenSellInputs)(wallets, tokenConfig);
    }
    /**
     * Sell tokens for a single wallet
     */
    async sellTokenSingle(wallet, tokenConfig) {
        return (0, tokenSell_1.sellTokenSingle)(wallet, tokenConfig);
    }
    /**
     * Sell tokens for multiple wallets (batch)
     */
    async sellTokenBatch(wallets, tokenConfig, customPercentages) {
        return (0, tokenSell_1.sellTokenBatch)(wallets, tokenConfig, customPercentages);
    }
    /**
     * Validate consolidation inputs before executing
     */
    validateConsolidation(sourceWallets, receiverWallet, percentage, sourceBalances) {
        return (0, consolidate_1.validateConsolidationInputs)(sourceWallets, receiverWallet, percentage, sourceBalances);
    }
    /**
     * Consolidate SOL from multiple source wallets to a single receiver wallet
     */
    async consolidateSOL(sourceWallets, receiverWallet, percentage) {
        return (0, consolidate_1.consolidateSOL)(sourceWallets, receiverWallet, percentage);
    }
    /**
     * Validate route quote inputs before executing
     */
    validateRouteQuote(config) {
        return (0, routeQuote_1.validateRouteQuoteInputs)(config);
    }
    /**
     * Get route quote for token buy/sell operations
     */
    async getRouteQuote(config) {
        return (0, routeQuote_1.getRouteQuote)(config);
    }
    /**
     * Get a buy quote for a specific token (convenience method)
     * @param tokenMintAddress - The token mint address
     * @param solAmount - Amount of SOL to spend
     * @param rpcUrl - Optional RPC URL override
     */
    async getBuyQuote(tokenMintAddress, solAmount, rpcUrl) {
        return (0, routeQuote_1.getBuyQuote)(tokenMintAddress, solAmount, rpcUrl);
    }
    /**
     * Get a sell quote for a specific token (convenience method)
     * @param tokenMintAddress - The token mint address
     * @param tokenAmount - Amount of tokens to sell
     * @param rpcUrl - Optional RPC URL override
     */
    async getSellQuote(tokenMintAddress, tokenAmount, rpcUrl) {
        return (0, routeQuote_1.getSellQuote)(tokenMintAddress, tokenAmount, rpcUrl);
    }
    /**
     * Validate transfer inputs before executing
     */
    validateTransfer(senderWallet, receiverAddress, amount, tokenAddress) {
        return (0, transfer_1.validateTransferInputs)(senderWallet, receiverAddress, amount, tokenAddress);
    }
    /**
     * Transfer SOL or tokens to a recipient
     */
    async transferTokens(senderWallet, receiverAddress, amount, tokenAddress) {
        return (0, transfer_1.transferTokens)(senderWallet, receiverAddress, amount, tokenAddress);
    }
    /**
     * Transfer SOL to a recipient (convenience method)
     */
    async transferSOL(senderWallet, recipientAddress, amount) {
        return (0, transfer_1.transferSOL)(senderWallet, recipientAddress, amount);
    }
    /**
     * Transfer tokens to a recipient (convenience method)
     */
    async transferToken(senderWallet, recipientAddress, tokenMint, amount) {
        return (0, transfer_1.transferToken)(senderWallet, recipientAddress, tokenMint, amount);
    }
    /**
     * Execute multiple transfers in sequence
     */
    async batchTransfer(senderWallet, transfers) {
        return (0, transfer_1.batchTransfer)(senderWallet, transfers);
    }
    /**
     * Validate token creation inputs before executing
     */
    validateTokenCreate(wallets, config) {
        return (0, create_1.validateTokenCreateInputs)(wallets, config);
    }
    /**
     * Create a token on the specified platform
     */
    async createTokenSingle(wallets, config) {
        return (0, create_1.createTokenSingle)(wallets, config);
    }
    /**
     * Create multiple tokens in batch with different configurations
     */
    async createTokenBatch(walletConfigs) {
        return (0, create_1.createTokenBatch)(walletConfigs);
    }
    /**
     * Validate token burn inputs before executing
     */
    validateTokenBurn(wallet, tokenAddress, amount) {
        return (0, burn_1.validateBurnInputs)(wallet, tokenAddress, amount);
    }
    /**
     * Burn tokens from a wallet
     */
    async burnToken(wallet, tokenAddress, amount) {
        return (0, burn_1.burnToken)(wallet, tokenAddress, amount);
    }
    /**
     * Burn multiple tokens in batch
     */
    async batchBurnToken(wallet, burns) {
        return (0, burn_1.batchBurnToken)(wallet, burns);
    }
}
exports.JetonSDK = JetonSDK;
//# sourceMappingURL=sdk.js.map