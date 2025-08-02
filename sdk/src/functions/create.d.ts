import { ApiResponse, Wallet, BundleResult, ValidationResult, Bundle } from '../types';
export type Platform = 'pump' | 'moon' | 'bonk' | 'cook' | 'boop';
export interface TokenMetadata {
    name: string;
    symbol: string;
    image: string;
    description?: string;
    twitter?: string;
    telegram?: string;
    website?: string;
    decimals?: number;
}
export interface PlatformConfig {
    type?: 'meme' | 'tech';
    rpcUrl?: string;
    trading?: {
        slippageBps?: number;
    };
    jito?: {
        tipAmount?: number;
    };
}
export interface TokenCreateConfig {
    platform: Platform;
    metadata: TokenMetadata;
    wallets: string[];
    amounts: number[] | number;
    platformConfig?: PlatformConfig;
}
export type TokenCreateBundle = Bundle;
export interface TokenCreateResult {
    success: boolean;
    mintAddress?: string;
    transactions?: string[];
    error?: string;
}
/**
 * Validate token creation inputs
 */
export declare const validateTokenCreateInputs: (wallets: Wallet[], config: TokenCreateConfig) => ValidationResult;
/**
 * Create token with single configuration
 */
export declare const createTokenSingle: (wallets: Wallet[], config: TokenCreateConfig) => Promise<ApiResponse<BundleResult[]>>;
/**
 * Create tokens in batch with multiple configurations
 */
export declare const createTokenBatch: (walletConfigs: {
    wallets: Wallet[];
    config: TokenCreateConfig;
}[]) => Promise<ApiResponse<BundleResult[][]>>;
//# sourceMappingURL=create.d.ts.map