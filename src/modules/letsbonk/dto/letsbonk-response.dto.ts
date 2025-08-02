import { ApiProperty } from '@nestjs/swagger';

export class LetsBonkResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: ['mock_letsbonk_tx_123456_0', 'mock_letsbonk_tx_123456_1'] })
  transactions: string[];

  @ApiProperty({ example: 'LetsBonk creation transactions prepared' })
  message: string;
}