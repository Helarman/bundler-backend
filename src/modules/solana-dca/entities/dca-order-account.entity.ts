import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DcaSolanaAccount, DcaTxType } from "@prisma/client";
import { Expose } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export interface IDcaAccountEntity extends DcaSolanaAccount {}

export class DcaAccountEntity implements IDcaAccountEntity {
  @Expose()
  @IsString()
  @ApiProperty({
    description: "The id of the solana DCA account (also public key)",
  })
  accountId: string;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The amount of SOL that will be used for each transaction",
    example: 0.01,
  })
  bumpOperateSolAmount: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "How much tokens we will sell every time",
    example: 50,
  })
  balanceUsagePercent: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The minimum price of the token to sell",
    example: 0.0000000278,
  })
  minTokenPrice: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The maximum price of the token to sell",
    example: 0.000008,
  })
  maxTokenPrice: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description:
      "The minimum delay between transactions for account in seconds",
    example: 15,
  })
  minDelayBetweenTxsInSeconds: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description:
      "The maximum delay between transactions for account in seconds",
    example: 60,
  })
  maxDelayBetweenTxsInSeconds: number;

  @Expose()
  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({
    description: "How much we ready to lost",
    example: 5,
  })
  slippagePercent: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "How much solana we will store in any circumstance",
    example: 0.1,
  })
  reserveSolAmount: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description:
      "When we will sell the token, we need to have at least this amount",
    example: 1000,
  })
  minTokenAmountPerSale: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "How much tokens we can buy",
    example: 20000000,
  })
  maxTokenAmount: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "How much tokens we will store in any circumstance",
    example: 2000000,
  })
  reserveTokenAmount: number;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    description: "Is buying allowed for auto orders?",
    example: true,
  })
  canBuy: boolean;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    description: "Is selling allowed for auto orders?",
    example: true,
  })
  canSell: boolean;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    description: "When active transactions will be working",
    example: true,
  })
  isActive: boolean;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "The date when the account was created",
  })
  createdAt: Date;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "The date when the account was last updated",
  })
  updatedAt: Date;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "Last tx type",
  })
  @ApiPropertyOptional()
  lastTxType: DcaTxType | null;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "Allow next at date",
  })
  allowNextAt: Date;
}
