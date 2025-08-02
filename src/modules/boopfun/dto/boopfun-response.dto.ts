import { ApiProperty } from '@nestjs/swagger';

export class BoopFunResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ type: [String], required: false })
  transactions?: string[];

  @ApiProperty({ required: false })
  mintAddress?: string;

  @ApiProperty()
  message: string;
}