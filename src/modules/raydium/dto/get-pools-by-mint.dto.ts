import { IsString, IsOptional, IsIn, IsNumber } from 'class-validator';

export class GetPoolsByMintDto {
  @IsString()
  mint1: string;

  @IsString()
  @IsOptional()
  mint2?: string;

  @IsOptional()
  @IsIn(['all', 'concentrated', 'standard'])
  poolType?: 'all' | 'concentrated' | 'standard' = 'all';

  @IsOptional()
  @IsNumber()
  pageSize?: number = 100;
}