import { IsNotEmpty, IsString } from 'class-validator';

export class TransferTokensDto {
  @IsString()
  @IsNotEmpty()
  senderPrivateKey: string;

  @IsString()
  @IsNotEmpty()
  receiver: string;

  @IsString()
  @IsNotEmpty()
  tokenAddress: string;

  @IsString()
  @IsNotEmpty()
  amount: string;
}