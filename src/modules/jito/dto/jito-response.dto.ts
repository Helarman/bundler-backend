import { ApiProperty } from '@nestjs/swagger';

export class JitoResponseDto<T = any> {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ required: false })
  result?: T;

  @ApiProperty({ required: false })
  currentTipAccount?: string;

  @ApiProperty({ required: false })
  error?: string;

  @ApiProperty({ required: false })
  jitoError?: any;

  @ApiProperty()
  message: string;
}