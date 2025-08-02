import { ApiProperty } from '@nestjs/swagger';

export class CookResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ 
    example: ['mock_cook_tx_123456_0', 'mock_cook_tx_123456_1'],
    description: 'Array of mock transaction IDs' 
  })
  transactions: string[];

  @ApiProperty({ 
    example: 'Cook creation transactions prepared',
    description: 'Status message' 
  })
  message: string;
}