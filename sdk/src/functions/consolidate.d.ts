import { Wallet, ValidationResult, ApiResponse, BundleResult } from '../types';
/**
 * Validate consolidation inputs
 */
export declare const validateConsolidationInputs: (sourceWallets: Wallet[], receiverWallet: Wallet, percentage: number, sourceBalances?: Map<string, number>) => ValidationResult;
/**
 * Execute SOL consolidation
 */
export declare const consolidateSOL: (sourceWallets: Wallet[], receiverWallet: Wallet, percentage: number) => Promise<ApiResponse<BundleResult[]>>;
//# sourceMappingURL=consolidate.d.ts.map