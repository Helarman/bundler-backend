import { IsString, IsNumber, IsBoolean, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { MixerConfigDto } from './config.dto';

class MixerWalletDto {
  @IsString()
  privateKey: string;

  @IsString()
  @IsOptional()
  amount?: string;
}

export class SingleMixRequestDto {
  @ValidateNested()
  @Type(() => MixerWalletDto)
  sender: MixerWalletDto;

  @ValidateNested()
  @Type(() => MixerWalletDto)
  recipient: MixerWalletDto;

  @IsOptional()
  config?: MixerConfigDto;
}

export class BatchMixRequestDto {
  @ValidateNested()
  @Type(() => MixerWalletDto)
  sender: MixerWalletDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MixerWalletDto)
  recipients: MixerWalletDto[];

  @IsOptional()
  config?: MixerConfigDto;
}

export class MixResponseDto {
  success: boolean;
  totalMixed?: number;
  stepsExecuted?: number;
  mixingRounds?: number;
  steps?: Array<{
    round: number;
    amount: number;
    delay: number;
  }>;
  error?: string;
  code?: string;
}

export class BatchMixResponseDto {
  success: boolean;
  totalMixed: number;
  successfulMixes: number;
  failedMixes: number;
  totalRecipients: number;
  results: Array<{
    recipientIndex: number;
    success: boolean;
    totalMixed: number;
    stepsExecuted: number;
    error?: string;
  }>;
}