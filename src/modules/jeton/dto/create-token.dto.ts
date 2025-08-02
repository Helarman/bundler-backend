import { IsArray, IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTokenDto {
  @IsArray()
  @IsString({ each: true })
  walletAddresses?: string[];

  @IsOptional()
  @IsString()
  platform?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  amounts?: number[];

  defaultSolAmount: number;

  metadata: any
}