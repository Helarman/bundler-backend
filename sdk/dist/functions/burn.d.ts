import { Wallet, ValidationResult, ApiResponse, BatchResult, BundleResult } from '../types';
/**
 * Burn configuration interface
 */
export interface BurnConfig {
    walletPublicKey: string;
    tokenAddress: string;
    amount: string;
}
/**
 * Burn result interface
 */
export interface BurnResult {
    success: boolean;
    transactions: string[];
}
/**
 * Validate burn inputs
 */
export declare const validateBurnInputs: (wallet: Wallet, tokenAddress: string, amount: string) => ValidationResult;
/**
 * Execute token burn
 */
export declare const burnToken: (wallet: Wallet, tokenAddress: string, amount: string) => Promise<ApiResponse<BundleResult[]>>;
/**
 * Batch burn tokens
 */
export declare const batchBurnToken: (wallet: Wallet, burns: Array<{
    tokenAddress: string;
    amount: string;
}>) => Promise<BatchResult>;
//# sourceMappingURL=burn.d.ts.map