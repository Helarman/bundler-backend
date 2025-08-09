import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class TransferAllDto {
  @Expose()
  @IsString()
  @ApiProperty({
    description: "The address to transfer SPL tokens to",
  })
  address: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: "The priority lamports fee",
    example: 40000,
  })
  @ApiPropertyOptional()
  priorityMicroLamptorsFee?: number;
}
