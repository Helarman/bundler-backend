import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Express } from "express";

export class TokenBuyerDto {
  @Expose()
  @IsString()
  @ApiProperty({
    description: "Address if of the token buyer",
  })
  address: string;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "Amount of solana to spend",
  })
  solAmount: number;
}

export class CreatePumpFunTokenDto {
  @Expose()
  @IsString()
  @ApiProperty({
    description:
      "Public key of of account that will be used for creating token",
  })
  owner: string;

  @Expose()
  @ApiProperty({
    description: "Token buyer",
    type: TokenBuyerDto,
    isArray: true,
  })
  buyers: TokenBuyerDto[];

  @Expose()
  @IsString()
  @ApiProperty({
    description: "Name of the token",
  })
  name: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "Symbol of the token",
  })
  symbol: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "Description of the token",
  })
  description: string;

  @Expose()
  @IsOptional()
  @ApiProperty({
    description: "Twitter",
  })
  @ApiPropertyOptional()
  twitter?: string;

  @Expose()
  @IsOptional()
  @ApiProperty({
    description: "Telegram",
  })
  @ApiPropertyOptional()
  telegram?: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "Website",
  })
  @ApiPropertyOptional()
  website?: string;

  @ApiProperty({
    type: "string",
    format: "binary",
    required: true,
  })
  file: Express.Multer.File;
}
