import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateClmmPoolDto {
  @IsString()
  mintA: string;

  @IsString()
  mintB: string;

  @IsString()
  mintAAmount: string;

  @IsString()
  mintBAmount: string;

  @IsString()
  initialPrice: string;

  @IsString()
  walletPrivateKey: string;

  @IsNumber()
  @IsOptional()
  startTime?: number;

  @IsNumber()
  @IsOptional()
  configIndex?: number;
}