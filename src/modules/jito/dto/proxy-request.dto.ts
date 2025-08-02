import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ProxyRequestDto {
  @IsString()
  @IsNotEmpty()
  method: string;

  @IsArray()
  params: any[] = [];
}