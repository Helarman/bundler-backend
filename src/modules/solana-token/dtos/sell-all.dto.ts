import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class SellAllSPLDto {
  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The amount of SPL tokens that will be left on the accounts",
    example: 0,
  })
  @ApiPropertyOptional()
  keepAmount: number;

  @Expose()
  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({
    description: "The percentage of how much for each account will be sold",
    example: 100,
  })
  percent: number;

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
