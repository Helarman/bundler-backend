import { Wallet, ValidationResult, ApiResponse, BatchResult, BundleResult } from '../types';
/**
 * Validate mixing inputs for single recipient
 */
export declare const validateSingleMixingInputs: (senderWallet: Wallet, recipientWallet: Wallet, senderBalance?: number) => ValidationResult;
/**
 * Validate mixing inputs for multiple recipients
 */
export declare const validateMixingInputs: (senderWallet: Wallet, recipientWallets: Wallet[], senderBalance?: number) => ValidationResult;
/**
 * Execute SOL mixing to a single recipient
 */
export declare const mixSOLToSingleRecipient: (senderWallet: Wallet, recipientWallet: Wallet) => Promise<ApiResponse<BundleResult[]>>;
/**
 * Batch mix SOL to multiple recipients, processing ONE RECIPIENT AT A TIME
 */
export declare const batchMixSOL: (senderWallet: Wallet, recipientWallets: Wallet[]) => Promise<BatchResult>;
//# sourceMappingURL=mixer.d.ts.map