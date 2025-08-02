import { IsString, IsArray } from 'class-validator';

export class GetPoolsInfoDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}