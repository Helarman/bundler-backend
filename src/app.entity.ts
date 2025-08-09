import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { App } from "@prisma/client";
import { Expose } from "class-transformer";
import { IsDate, IsNumber, IsString, IsOptional } from "class-validator";

export interface IAppEntity extends Partial<Omit<App, "id">> {}

export class AppEntity implements IAppEntity {
  @Expose()
  @IsString()
  @ApiProperty({
    description: "The public key of the token that we will pump!",
  })
  tokenId: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The public key of the bonding curve",
  })
  bondingCurveId: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The public key of the associated bonding curve",
  })
  associatedBondingCurveId: string;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The balance usage percentage",
  })
  balanceUsagePercent: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The priority lamports fee",
  })
  priorityMicroLamptorsFee: number;

  @Expose()
  @IsOptional()
  @IsDate()
  @ApiProperty({
    description: "The date when the token was last synced",
  })
  @ApiPropertyOptional()
  lastSyncedAt?: Date | null;
}
