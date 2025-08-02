import { IsString } from 'class-validator';

export class GetPoolLiquidityDto {
  @IsString()
  poolId: string;
}
