import { IsString, IsNotEmpty } from 'class-validator';

export class BundleStatusDto {
  @IsString()
  @IsNotEmpty()
  bundleId: string;
}