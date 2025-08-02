import { PublicKey } from '@solana/web3.js'

export interface Wallet {
  id: number;
  address: string;
  privateKey: string;
  isActive: boolean;
  tokenBalance?: number;
  balance?: number;
}

export interface ConfigType {
  rpcEndpoint: string;
  transactionFee: string;
  apiKey: string;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  price?: number;
  balance?: number;
}

export interface DexConfig {
  name: string;
  address: string;
  type: 'jupiter' | 'raydium' | 'pumpfun' | 'moonshot' | 'pumpswap' | 'launchpad' | 'boopfun' | 'letsbonk' | 'cook';
}

export interface TradeParams {
  tokenAddress: string;
  amount: number;
  slippage: number;
  dex: string;
  wallet: Wallet;
  isBuy: boolean;
}

export interface DeployParams {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  wallet: Wallet;
  type: 'pumpfun' | 'moonshot' | 'boopfun' | 'letsbonk' | 'cook';
}

export interface BurnParams {
  tokenAddress: string;
  amount: number;
  wallet: Wallet;
}

export interface PnlParams {
  tokenAddress: string;
  wallet: Wallet;
  startDate?: Date;
  endDate?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TransactionResponse {
  signature: string;
  status: 'success' | 'error';
  error?: string;
}

export interface AnalyticsData {
  totalVolume: number;
  totalTrades: number;
  averagePrice: number;
  priceChange24h: number;
  volume24h: number;
}

export interface WalletBalance {
  solBalance: number;
  tokenBalance: number;
  tokenAddress: string;
} 