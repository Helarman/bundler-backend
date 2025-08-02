import { RaydiumMintInfo } from "./mint-info.interface";
import { RaydiumPoolInfo } from "./pool-info.interface";

export interface RaydiumTokenAnalysis {
  mintInfo: RaydiumMintInfo | null;
  price: string | null;
  pools: RaydiumPoolInfo[];
  totalLiquidity: number;
  totalVolume24h: number;
}