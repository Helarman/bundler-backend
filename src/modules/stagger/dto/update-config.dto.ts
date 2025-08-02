import { IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class UpdateConfigDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(20)
  maxConcurrentOperations?: number;

  @IsNumber()
  @IsOptional()
  @Min(500)
  @Max(60000)
  defaultDelay?: number;

  @IsNumber()
  @IsOptional()
  @Min(100)
  @Max(30000)
  minDelay?: number;

  @IsNumber()
  @IsOptional()
  @Min(1000)
  @Max(300000)
  maxDelay?: number;

  @IsNumber()
  @IsOptional()
  @Min(1000)
  @Max(60000)
  retryDelay?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  maxRetries?: number;

  @IsBoolean()
  @IsOptional()
  enablePriorityQueuing?: boolean;

  @IsBoolean()
  @IsOptional()
  enableAutoRetry?: boolean;
}