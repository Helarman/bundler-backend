import { IsNumber, IsOptional } from 'class-validator';

export class CleanupDto {
  @IsNumber()
  @IsOptional()
  olderThanHours?: number = 24;
}