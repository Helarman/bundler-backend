import { IsArray, IsNotEmpty, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TokenSellConfigDto {
  @IsString()
  @IsNotEmpty()
  tokenAddress: string;

  @IsString()
  @IsNotEmpty()
  protocol: string;

  @IsNumber()
  percentage: number;
}

export class SellTokensDto {
  @IsArray()
  @IsString({ each: true })
  walletAddresses: string[];

  @ValidateNested()
  @Type(() => TokenSellConfigDto)
  tokenConfig: TokenSellConfigDto;

  @IsArray()
  @IsNumber({}, { each: true })
  customPercentages?: number[];
}