import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class TransferSplTokenDto {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({
    description: "Percent of current balance to transfer",
    example: 100,
  })
  @ApiPropertyOptional()
  percent: number;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The address to transfer SPL tokens to",
  })
  recipient: string;

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
