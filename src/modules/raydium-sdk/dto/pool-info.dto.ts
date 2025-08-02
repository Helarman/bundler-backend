export class PoolInfoDto {
  id: string;
  type: 'CPMM' | 'CLMM' | 'AMM';
  mintA: string;
  mintB: string;
  liquidity: string;
  price: number;
}