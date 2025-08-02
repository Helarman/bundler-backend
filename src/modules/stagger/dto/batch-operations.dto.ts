import { IsArray, ValidateNested, IsNumber, IsOptional, IsString, IsIn, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { AddOperationDto } from './add-operation.dto';

export class BatchOperationsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddOperationDto)
  operations: AddOperationDto[];

  @IsNumber()
  @IsOptional()
  @Min(500)
  @Max(60000)
  staggerDelay?: number;

  @IsString()
  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'urgent'])
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}