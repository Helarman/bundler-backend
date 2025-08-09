import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, Max, Min } from "class-validator";

export interface ISellTokenDto {
  tokenAmount: number;
  slippagePercent?: number;
  skipLimit?: boolean;
  priorityMicroLamptorsFee?: number;
}

export class SellTokenDto implements ISellTokenDto {
  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The amount of token to sell",
    example: 10000,
  })
  tokenAmount: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({
    description: "The slippage percentage",
    example: 1,
  })
  @ApiPropertyOptional()
  slippagePercent?: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: "Skip limit order",
    example: false,
    default: false,
  })
  @ApiPropertyOptional()
  skipLimit?: boolean;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: "The priority lamports fee",
    example: 0,
  })
  @ApiPropertyOptional()
  priorityMicroLamptorsFee?: number;
}
