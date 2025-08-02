import { IsString } from 'class-validator';

export class GetTokenAnalysisDto {
  @IsString()
  mintAddress: string;
}
