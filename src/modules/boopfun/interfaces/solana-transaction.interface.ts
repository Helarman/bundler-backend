import { VersionedTransaction } from '@solana/web3.js';

export interface SolanaTransaction {
  transaction: VersionedTransaction;
  signers: string[];
}