import { ApiResponse, Wallet, BundleResult, ValidationResult, Bundle } from '../types';
export type Protocol = 'pumpfun' | 'moonshot' | 'launchpad' | 'raydium' | 'pumpswap' | 'jupiter' | 'boopfun';
export interface TokenBuyConfig {
    tokenAddress: string;
    solAmount: number;
    protocol: Protocol;
    slippageBps?: number;
    jitoTipLamports?: number;
}
export type TokenBuyBundle = Bundle;
/**
 * Execute token buy operation for a single wallet
 */
export declare const buyTokenSingle: (wallet: Wallet, tokenConfig: TokenBuyConfig) => Promise<ApiResponse<BundleResult[]>>;
/**
 * Execute token buy operation for multiple wallets (batch)
 */
export declare const buyTokenBatch: (wallets: Wallet[], tokenConfig: TokenBuyConfig, customAmounts?: number[]) => Promise<ApiResponse<BundleResult[][]>>;
/**
 * Validate token buy inputs
 */
export declare const validateTokenBuyInputs: (wallets: Wallet[], tokenConfig: TokenBuyConfig) => ValidationResult;
//# sourceMappingURL=tokenBuy.d.ts.map