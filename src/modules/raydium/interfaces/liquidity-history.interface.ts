export interface RaydiumLiquidityHistory {
  count: number;
  line: Array<{ time: number; liquidity: number }>;
}