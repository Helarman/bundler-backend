import { IsString } from 'class-validator';

export class GetTokenInfoDto {
  @IsString({ each: true })
  mints: string[];
}
