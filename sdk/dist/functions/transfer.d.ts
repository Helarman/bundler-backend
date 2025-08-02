import { Wallet, ValidationResult, ApiResponse, BatchResult, BundleResult } from '../types';
/**
 * Transfer configuration interface
 */
export interface TransferConfig {
    senderPublicKey: string;
    receiver: string;
    tokenAddress?: string;
    amount: string;
}
/**
 * Transfer result interface
 */
export interface TransferResult {
    success: boolean;
    transactions: string[];
}
/**
 * Validate transfer inputs
 */
export declare const validateTransferInputs: (senderWallet: Wallet, receiverAddress: string, amount: string, tokenAddress?: string) => ValidationResult;
/**
 * Execute SOL or token transfer
 */
export declare const transferTokens: (senderWallet: Wallet, receiverAddress: string, amount: string, tokenAddress?: string) => Promise<ApiResponse<BundleResult[]>>;
/**
 * Execute SOL transfer (convenience function)
 */
export declare const transferSOL: (senderWallet: Wallet, receiverAddress: string, amount: string) => Promise<ApiResponse<BundleResult[]>>;
/**
 * Execute token transfer (convenience function)
 */
export declare const transferToken: (senderWallet: Wallet, receiverAddress: string, amount: string, tokenAddress: string) => Promise<ApiResponse<BundleResult[]>>;
/**
 * Batch transfer to multiple recipients
 */
export declare const batchTransfer: (senderWallet: Wallet, transfers: Array<{
    receiverAddress: string;
    amount: string;
    tokenAddress?: string;
}>) => Promise<BatchResult>;
//# sourceMappingURL=transfer.d.ts.map