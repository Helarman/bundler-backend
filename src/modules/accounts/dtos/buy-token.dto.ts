import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export interface IBuyTokenDto {
  solAmount: number;
  slippagePercent?: number;
  priorityMicroLamptorsFee?: number;
}

export class BuyTokenDto implements IBuyTokenDto {
  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The amount of SOL to spend",
    example: 0.001,
  })
  solAmount: number;

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
  @IsNumber()
  @ApiProperty({
    description: "The priority lamports fee",
    example: 0,
  })
  @ApiPropertyOptional()
  priorityMicroLamptorsFee?: number;
}
