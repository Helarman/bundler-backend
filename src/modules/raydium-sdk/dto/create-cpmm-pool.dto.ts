import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCpmmPoolDto {
  @IsString()
  mintA: string;

  @IsString()
  mintB: string;

  @IsString()
  mintAAmount: string;

  @IsString()
  mintBAmount: string;

  @IsString()
  walletPrivateKey: string;

  @IsNumber()
  @IsOptional()
  startTime?: number;

  @IsNumber()
  @IsOptional()
  feeConfigIndex?: number;
}