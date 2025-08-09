import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class BuyAllSPLDto {
  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The amount of solana that will be left on the accounts",
    example: 0.01,
  })
  @ApiPropertyOptional()
  keepSolanaAmount: number;

  @Expose()
  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({
    description: "The percentage of the solana balance that will be bought",
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
