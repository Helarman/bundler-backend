export interface CreatePoolResult {
  txId: string;
  poolId: string;
  poolKeys: Record<string, string>;
}

export interface FeeConfig {
  id: string;
  index: number;
  tradeFeeRate: number;
  protocolFeeRate: number;
  fundFeeRate: number;
}