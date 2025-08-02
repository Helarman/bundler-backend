import { IsNumber, IsBoolean, Min, Max, IsOptional } from 'class-validator';

export class MixerConfigDto {
  @IsNumber()
  @Min(0.001)
  @Max(1)
  @IsOptional()
  minAmount?: number;

  @IsNumber()
  @Min(0.001)
  @Max(10)
  @IsOptional()
  maxAmount?: number;

  @IsNumber()
  @Min(100)
  @Max(30000)
  @IsOptional()
  minDelay?: number;

  @IsNumber()
  @Min(100)
  @Max(60000)
  @IsOptional()
  maxDelay?: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  mixingRounds?: number;

  @IsBoolean()
  @IsOptional()
  useRandomAmounts?: boolean;

  @IsBoolean()
  @IsOptional()
  enableTimingVariation?: boolean;
}

export class ConfigValidationResponseDto {
  valid: boolean;
  error?: string;
  config: MixerConfigDto;
}