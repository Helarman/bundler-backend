import { IsString, IsObject, IsNumber, IsOptional, IsDateString, IsIn, Max, Min } from 'class-validator';

export class AddOperationDto {
  @IsString()
  @IsIn(['buy', 'sell', 'transfer', 'distribute', 'consolidate'])
  type: 'buy' | 'sell' | 'transfer' | 'distribute' | 'consolidate';

  @IsObject()
  parameters: any;

  @IsNumber()
  @IsOptional()
  @Min(500)
  @Max(300000)
  delay?: number;

  @IsString()
  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'urgent'])
  priority?: 'low' | 'medium' | 'high' | 'urgent';

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  maxRetries?: number;

  @IsDateString()
  @IsOptional()
  executeAt?: string;
}
