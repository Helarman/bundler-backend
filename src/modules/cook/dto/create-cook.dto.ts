import { IsArray, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TokenMetadataDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  symbol?: string;

  @IsString()
  uri?: string;
}

class CookConfigDto {
  @IsObject()
  @ValidateNested()
  @Type(() => TokenMetadataDto)
  tokenMetadata: TokenMetadataDto;
}

export class CreateCookDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CookConfigDto)
  config: CookConfigDto;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  buyerWallets: string[];
}