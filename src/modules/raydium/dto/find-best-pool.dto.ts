import { IsString } from 'class-validator';

export class FindBestPoolDto {
  @IsString()
  mintA: string;

  @IsString()
  mintB: string;
}

