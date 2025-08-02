import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SendBundleDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  transactions: string[];
}