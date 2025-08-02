import { ApiResponse, Wallet, BundleResult, ValidationResult, Bundle } from '../types';
export type Protocol = 'pumpfun' | 'moonshot' | 'launchpad' | 'raydium' | 'pumpswap' | 'jupiter' | 'boopfun';
export interface TokenSellConfig {
    tokenAddress: string;
    sellPercent: number;
    protocol: Protocol;
    slippageBps?: number;
    jitoTipLamports?: number;
}
export type TokenSellBundle = Bundle;
/**
 * Execute token sell operation for a single wallet
 */
export declare const sellTokenSingle: (wallet: Wallet, tokenConfig: TokenSellConfig) => Promise<ApiResponse<BundleResult[]>>;
/**
 * Execute token sell operation for multiple wallets (batch)
 */
export declare const sellTokenBatch: (wallets: Wallet[], tokenConfig: TokenSellConfig, customPercentages?: number[]) => Promise<ApiResponse<BundleResult[][]>>;
/**
 * Validate token sell inputs
 */
export declare const validateTokenSellInputs: (wallets: Wallet[], tokenConfig: TokenSellConfig) => ValidationResult;
//# sourceMappingURL=tokenSell.d.ts.map