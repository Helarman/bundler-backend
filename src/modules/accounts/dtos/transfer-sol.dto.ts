import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class TransferSolDto {
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
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: "The amount of SOL to transfer",
    example: 0.001,
  })
  @ApiPropertyOptional()
  amount: number;

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

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: "Ignore recipient not found error",
    example: false,
  })
  @ApiPropertyOptional()
  ignoreRecipientNotFound?: boolean;
}
