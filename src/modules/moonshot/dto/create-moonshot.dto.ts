import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TokenMetadataDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  symbol?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

class MoonshotConfigDto {
  @ValidateNested()
  @Type(() => TokenMetadataDto)
  tokenMetadata: TokenMetadataDto;

  @IsOptional()
  @IsArray()
  additionalParams?: any[];
}

export class CreateMoonshotDto {
  @ValidateNested()
  @Type(() => MoonshotConfigDto)
  config: MoonshotConfigDto;

  @IsArray()
  @IsNotEmpty()
  buyerWallets: any[];
}