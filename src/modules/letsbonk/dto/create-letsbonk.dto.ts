import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

class TokenMetadataDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  symbol?: string;

  @IsString()
  uri?: string;
}

export class CreateLetsBonkDto {
  @IsObject()
  @IsNotEmpty()
  tokenMetadata: TokenMetadataDto;

  @IsString()
  @IsNotEmpty()
  ownerPublicKey: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  buyerWallets: string[];

  @IsNumber()
  @IsNotEmpty()
  initialBuyAmount: number;
}