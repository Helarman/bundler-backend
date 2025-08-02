import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class TokenMetadataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  totalSupply: string;

  @ApiProperty({ type: [Object] })
  @IsArray()
  @IsOptional()
  links: Array<{ url: string; label: string }>;
}

export class TokenCreationConfigDto {
  @ApiProperty({ type: TokenMetadataDto })
  @IsObject()
  @IsNotEmpty()
  metadata: TokenMetadataDto;

  @ApiProperty()
  @IsNotEmpty()
  defaultSolAmount: number;
}

export class JitoConfigDto {
  @ApiProperty()
  @IsNotEmpty()
  tipAmount: number;
}

export class BoopFunConfigDto {
  @ApiProperty({ type: TokenCreationConfigDto })
  @IsObject()
  @IsNotEmpty()
  tokenCreation: TokenCreationConfigDto;

  @ApiProperty({ type: JitoConfigDto })
  @IsObject()
  @IsNotEmpty()
  jito: JitoConfigDto;
}

export class CreateBoopFunDto {
  @ApiProperty({ type: BoopFunConfigDto })
  @IsObject()
  @IsNotEmpty()
  config: BoopFunConfigDto;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty()
  buyerWallets: string[];
  
  walletAddresses: any;
}