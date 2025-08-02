import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TokenMetadataDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsOptional()
  file?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  twitter?: string;

  @IsString()
  @IsOptional()
  telegram?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsOptional()
  decimals?: number;
}

class TokenCreationConfigDto {
  @ValidateNested()
  @Type(() => TokenMetadataDto)
  metadata: TokenMetadataDto;
}

export class CreateTokenDto {
  @IsArray()
  @IsNotEmpty()
  walletAddresses: string[];

  @IsArray()
  @IsNotEmpty()
  amounts: number[];

  @IsString()
  @IsNotEmpty()
  mintPubkey: string;

  @ValidateNested()
  @Type(() => TokenCreationConfigDto)
  config: {
    tokenCreation: {
      metadata: TokenMetadataDto;
    };
  };
}