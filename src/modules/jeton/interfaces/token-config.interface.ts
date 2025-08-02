import { Protocol } from "../../../../sdk/dist";

export interface TokenBuyConfig {
  tokenAddress: string;
  protocol: Protocol;
  solAmount: number;
}

export interface TokenSellConfig {
  tokenAddress: string;
  protocol: Protocol;
  sellPercent: number;
  
}

export interface TokenCreateConfig {
  platform?: string;
  [key: string]: any;
}
