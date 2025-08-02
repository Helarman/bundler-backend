import { Keypair } from '@solana/web3.js';
export interface BundleResult {
    jsonrpc: string;
    id: number;
    result?: string;
    error?: {
        code: number;
        message: string;
    };
}
import { SDKConfig } from './types';
/**
 * Configure the SDK with base URL and other settings
 */
export declare const configure: (newConfig: SDKConfig) => void;
/**
 * Get the current configuration
 */
export declare const getConfig: () => SDKConfig;
/**
 * Debug logging utility - only logs when debug is enabled
 */
export declare const debugLog: (...args: any[]) => void;
/**
 * Debug error logging utility - only logs when debug is enabled
 */
export declare const debugError: (...args: any[]) => void;
/**
 * Send bundle to Jito block engine via backend proxy
 */
export declare const sendBundle: (encodedBundle: string[]) => Promise<BundleResult>;
/**
 * Complete transaction signing with sender and recipient keys
 */
export declare const completeTransactionSigning: (TransactionsBase58: string[], senderKeypair: Keypair, recipientKeypairs: Map<string, Keypair>) => string[];
/**
 * Create keypair from private key string
 */
export declare const createKeypairFromPrivateKey: (privateKey: string) => Keypair;
/**
 * Create a map of public keys to keypairs for efficient lookups
 */
export declare const createKeypairMap: (wallets: {
    privateKey: string;
}[]) => Map<string, Keypair>;
/**
 * Prepare distribution bundles from signed transactions with max 5 transactions per bundle
 */
export declare const prepareTransactionBundles: (signedTransactions: string[]) => {
    transactions: string[];
}[];
/**
 * Add delay between operations
 */
export declare const delay: (ms: number) => Promise<void>;
/**
 * Validate wallet data
 */
export declare const validateWallet: (wallet: {
    privateKey: string;
}) => boolean;
/**
 * Get SOL balance for a wallet
 */
export declare const getWalletBalance: (privateKey: string, rpcUrl: string) => Promise<number>;
/**
 * Get wallet address from private key
 */
export declare const getWalletAddress: (privateKey: string) => string;
/**
 * Validate amount string
 */
export declare const validateAmount: (amount: string) => boolean;
//# sourceMappingURL=utils.d.ts.map