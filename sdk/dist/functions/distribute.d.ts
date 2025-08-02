import { Wallet, ValidationResult, ApiResponse, BatchResult, BundleResult } from '../types';
/**
 * Validate distribution inputs
 */
export declare const validateDistributionInputs: (senderWallet: Wallet, recipientWallets: Wallet[], senderBalance?: number) => ValidationResult;
/**
 * Execute SOL distribution
 */
export declare const distributeSOL: (senderWallet: Wallet, recipientWallets: Wallet[]) => Promise<ApiResponse<BundleResult[]>>;
/**
 * Batch distribute SOL to multiple recipients, splitting into groups of max 3 recipients per request
 */
export declare const batchDistributeSOL: (senderWallet: Wallet, recipientWallets: Wallet[]) => Promise<BatchResult>;
//# sourceMappingURL=distribute.d.ts.map