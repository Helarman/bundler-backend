export interface RaydiumMintInfo {
  chainId: number;
  address: string;
  programId: string;
  logoURI: string;
  symbol: string;
  name: string;
  decimals: number;
  tags?: string[];
  extensions?: {
    coingeckoId?: string;
    feeConfig?: any;
  };
}