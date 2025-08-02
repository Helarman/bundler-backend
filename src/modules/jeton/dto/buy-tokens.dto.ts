import { IsArray, IsNotEmpty, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TokenBuyConfigDto {
  @IsString()
  @IsNotEmpty()
  tokenAddress: string;

  @IsString()
  @IsNotEmpty()
  protocol: string;

  @IsNumber()
  solAmount: number;
}

export class BuyTokensDto {
  @IsArray()
  @IsString({ each: true })
  walletAddresses: string[];

  @ValidateNested()
  @Type(() => TokenBuyConfigDto)
  tokenConfig: TokenBuyConfigDto;

  @IsArray()
  @IsNumber({}, { each: true })
  customAmounts?: number[];
}