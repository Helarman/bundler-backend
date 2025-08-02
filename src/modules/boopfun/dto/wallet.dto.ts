import { ApiProperty } from '@nestjs/swagger';

export class WalletDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  privateKey: string;
}