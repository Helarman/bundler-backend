import { IsString, IsNumber, Min, Max } from 'class-validator';

export class SwapParamsDto {
  @IsString()
  inputMint: string;

  @IsString()
  outputMint: string;

  @IsString()
  inputAmount: string;

  @IsNumber()
  @Min(0.0001)
  @Max(1)
  slippage: number;

  @IsString()
  walletPrivateKey: string;

  @IsString()
  poolId?: string;
}