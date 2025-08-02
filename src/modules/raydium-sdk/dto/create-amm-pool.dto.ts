import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAmmPoolDto {
  @IsString()
  mintA: string;

  @IsString()
  mintB: string;

  @IsString()
  mintAAmount: string;

  @IsString()
  mintBAmount: string;

  @IsString()
  marketId: string;

  @IsString()
  walletPrivateKey: string;

  @IsNumber()
  @IsOptional()
  startTime?: number;
}