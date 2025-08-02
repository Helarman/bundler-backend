import { Protocol } from "../../../../sdk/dist";

export class TokenBuyDto {
  walletAddresses: string[];
  tokenAddress: string;
  solAmount: number;
  protocol?: Protocol = 'jupiter';
  amounts?: number[];
  jitoTipLamports?: number;
  slippageBps?: number;
  customAmounts?: number[]
  
}

export class TokenSellDto {
  walletAddresses: string[];
  tokenAddress: string;
  percentage?: number;
  protocol?: Protocol = 'jupiter';
  jitoTipLamports?: number;
  slippageBps?: number;
  sellPercent?: number;   
  customPercentages?: number[];  
}

export class TokenTransferDto {
  senderPrivateKey: string;
  receiver: string;
  tokenAddress: string;
  amount: string;
}

export class TokenBurnDto {
  walletPrivateKey: string;
  tokenAddress: string;
  amount: string;
}

export class TokenCleanerDto {
  sellerAddress: string;
  buyerAddress: string;
  tokenAddress: string;
  sellPercentage: number;
  buyPercentage: number;
}

export class TokenInfoResponseDto {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  description: string;
  image: string | null;
  website: string | null;
  twitter: string | null;
  telegram: string | null;
}

export class TransactionResponseDto {
  success: boolean;
  transactions?: string[];
  bundles?: { transactions: string[] }[];
  data?: any;
  message?: string;
  error?: string;
}