import { RaydiumMintInfo } from "./mint-info.interface";

export interface RaydiumPoolInfo {
  id: string;
  type: 'concentrated' | 'standard';
  mintA: RaydiumMintInfo;
  mintB: RaydiumMintInfo;
  liquidity: number;
  volume24h: number;
  fee24h: number;
  apr24h: number;
  tvl: number;
  price: number;
}