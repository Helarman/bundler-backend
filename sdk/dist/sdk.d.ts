import { TokenBuyConfig } from './functions/tokenBuy';
import { TokenSellConfig } from './functions/tokenSell';
import { RouteQuoteConfig, RouteQuoteResult } from './functions/routeQuote';
import { TokenCreateConfig } from './functions/create';
import { SDKConfig, Wallet, ValidationResult, ApiResponse, BatchResult, BundleResult } from './types';
/**
 * Main JetonSDK class providing access to all Solana transaction operations
 */
export declare class JetonSDK {
    /**
     * Initialize the SDK with configuration
     */
    constructor(config: SDKConfig);
    /**
     * Update SDK configuration
     */
    configure(config: SDKConfig): void;
    /**
     * Get current SDK configuration
     */
    getConfig(): SDKConfig;
    /**
     * Validate distribution inputs before executing
     */
    validateDistribution(senderWallet: Wallet, recipientWallets: Wallet[], senderBalance?: number): ValidationResult;
    /**
     * Distribute SOL to multiple recipients
     */
    distributeSOL(senderWallet: Wallet, recipientWallets: Wallet[]): Promise<ApiResponse<BundleResult[]>>;
    /**
     * Batch distribute SOL to multiple recipients with automatic batching
     */
    batchDistributeSOL(senderWallet: Wallet, recipientWallets: Wallet[]): Promise<BatchResult>;
    /**
     * Validate mixing inputs before executing
     */
    validateMixing(senderWallet: Wallet, recipientWallets: Wallet[], senderBalance?: number): ValidationResult;
    /**
     * Validate single recipient mixing inputs before executing
     */
    validateSingleMixing(senderWallet: Wallet, recipientWallet: Wallet, senderBalance?: number): ValidationResult;
    /**
     * Mix SOL to a single recipient (optimized)
     */
    mixSOLToSingleRecipient(senderWallet: Wallet, recipientWallet: Wallet): Promise<ApiResponse<BundleResult[]>>;
    /**
     * Batch mix SOL to multiple recipients, processing one recipient at a time
     */
    batchMixSOL(senderWallet: Wallet, recipientWallets: Wallet[]): Promise<BatchResult>;
    /**
     * Validate token buy inputs before executing
     */
    validateTokenBuy(wallets: Wallet[], tokenConfig: TokenBuyConfig): {
        valid: boolean;
        error?: string;
    };
    /**
     * Buy tokens for a single wallet
     */
    buyTokenSingle(wallet: Wallet, tokenConfig: TokenBuyConfig): Promise<ApiResponse<BundleResult[]>>;
    /**
     * Buy tokens for multiple wallets (batch)
     */
    buyTokenBatch(wallets: Wallet[], tokenConfig: TokenBuyConfig, customAmounts?: number[]): Promise<ApiResponse<BundleResult[][]>>;
    /**
     * Validate token sell inputs before executing
     */
    validateTokenSell(wallets: Wallet[], tokenConfig: TokenSellConfig): {
        valid: boolean;
        error?: string;
    };
    /**
     * Sell tokens for a single wallet
     */
    sellTokenSingle(wallet: Wallet, tokenConfig: TokenSellConfig): Promise<ApiResponse<BundleResult[]>>;
    /**
     * Sell tokens for multiple wallets (batch)
     */
    sellTokenBatch(wallets: Wallet[], tokenConfig: TokenSellConfig, customPercentages?: number[]): Promise<ApiResponse<BundleResult[][]>>;
    /**
     * Validate consolidation inputs before executing
     */
    validateConsolidation(sourceWallets: Wallet[], receiverWallet: Wallet, percentage: number, sourceBalances?: Map<string, number>): ValidationResult;
    /**
     * Consolidate SOL from multiple source wallets to a single receiver wallet
     */
    consolidateSOL(sourceWallets: Wallet[], receiverWallet: Wallet, percentage: number): Promise<ApiResponse<BundleResult[]>>;
    /**
     * Validate route quote inputs before executing
     */
    validateRouteQuote(config: RouteQuoteConfig): {
        valid: boolean;
        error?: string;
    };
    /**
     * Get route quote for token buy/sell operations
     */
    getRouteQuote(config: RouteQuoteConfig): Promise<ApiResponse<RouteQuoteResult>>;
    /**
     * Get a buy quote for a specific token (convenience method)
     * @param tokenMintAddress - The token mint address
     * @param solAmount - Amount of SOL to spend
     * @param rpcUrl - Optional RPC URL override
     */
    getBuyQuote(tokenMintAddress: string, solAmount: number, rpcUrl?: string): Promise<ApiResponse<RouteQuoteResult>>;
    /**
     * Get a sell quote for a specific token (convenience method)
     * @param tokenMintAddress - The token mint address
     * @param tokenAmount - Amount of tokens to sell
     * @param rpcUrl - Optional RPC URL override
     */
    getSellQuote(tokenMintAddress: string, tokenAmount: number, rpcUrl?: string): Promise<ApiResponse<RouteQuoteResult>>;
    /**
     * Validate transfer inputs before executing
     */
    validateTransfer(senderWallet: Wallet, receiverAddress: string, amount: string, tokenAddress?: string): ValidationResult;
    /**
     * Transfer SOL or tokens to a recipient
     */
    transferTokens(senderWallet: Wallet, receiverAddress: string, amount: string, tokenAddress?: string): Promise<ApiResponse<BundleResult[]>>;
    /**
     * Transfer SOL to a recipient (convenience method)
     */
    transferSOL(senderWallet: Wallet, recipientAddress: string, amount: string): Promise<ApiResponse<BundleResult[]>>;
    /**
     * Transfer tokens to a recipient (convenience method)
     */
    transferToken(senderWallet: Wallet, recipientAddress: string, tokenMint: string, amount: string): Promise<ApiResponse<BundleResult[]>>;
    /**
     * Execute multiple transfers in sequence
     */
    batchTransfer(senderWallet: Wallet, transfers: Array<{
        receiverAddress: string;
        amount: string;
        tokenAddress?: string;
    }>): Promise<BatchResult>;
    /**
     * Validate token creation inputs before executing
     */
    validateTokenCreate(wallets: Wallet[], config: TokenCreateConfig): ValidationResult;
    /**
     * Create a token on the specified platform
     */
    createTokenSingle(wallets: Wallet[], config: TokenCreateConfig): Promise<ApiResponse<BundleResult[]>>;
    /**
     * Create multiple tokens in batch with different configurations
     */
    createTokenBatch(walletConfigs: {
        wallets: Wallet[];
        config: TokenCreateConfig;
    }[]): Promise<ApiResponse<BundleResult[][]>>;
    /**
     * Validate token burn inputs before executing
     */
    validateTokenBurn(wallet: Wallet, tokenAddress: string, amount: string): ValidationResult;
    /**
     * Burn tokens from a wallet
     */
    burnToken(wallet: Wallet, tokenAddress: string, amount: string): Promise<ApiResponse<BundleResult[]>>;
    /**
     * Burn multiple tokens in batch
     */
    batchBurnToken(wallet: Wallet, burns: Array<{
        tokenAddress: string;
        amount: string;
    }>): Promise<BatchResult>;
}
//# sourceMappingURL=sdk.d.ts.map