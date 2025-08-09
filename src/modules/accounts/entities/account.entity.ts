import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Account, AccountType } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";
import {
  IsString,
  IsUUID,
  IsHexColor,
  IsOptional,
  Length,
  IsBoolean,
  IsDate,
  IsDecimal,
  IsEnum,
} from "class-validator";

export interface IAccountEntity extends Partial<Account> {
  id: string;
  type: AccountType;
  name?: string;
  color?: string;
  balance: number;
  tokenBalance: number;
  tokenAccountId?: string | null;
  isBalanceSynced: boolean;
  isTokenBalanceSynced: boolean;
  isTokenAccountInitialized: boolean;
  publicKey: string;
  secretKey: string;
  isActive: boolean;
  isImported: boolean;
  isRemoved: boolean;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date | null;
  lastBuyAt?: Date  | null;
  lastSellAt?: Date  | null;
  removedAt?: Date  | null;
  exportedAt?: Date  | null;
  syncProblemInspectedAt?: Date  | null;
}

export class AccountEntity implements IAccountEntity {
  @Expose()
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: "The unique identifier of the account",
    example: "c24ef4b2-bd4a-4d5a-ae4c-d1b3ee1e4f4e",
  })
  id: string;

  @Expose()
  @IsEnum(AccountType)
  @ApiProperty({
    description: "The type of the account",
    example: AccountType.SOLANA,
  })
  type: AccountType;

  @Expose()
  @IsOptional()
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: "The unique identifier of the user that created the account",
    example: "c24ef4b2-bd4a-4d5a-ae4c-d1b3ee1e4f4e",
  })
  @ApiPropertyOptional()
  userId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsHexColor()
  @ApiProperty({
    description: "The color of the account",
    example: "#ff0000",
  })
  @ApiPropertyOptional()
  color?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(5, 100)
  @ApiProperty({
    description: "The name of the account",
    example: "JohnDoe",
  })
  @ApiPropertyOptional()
  name?: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The public key of the solana account",
    example: "5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAnchuDf",
  })
  publicKey: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "The public key of the solana token account",
    example: "5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAnchuDf",
  })
  tokenAccountId?: string | null;

  @Exclude()
  @IsString()
  secretKey: string;

  @Expose()
  @IsDecimal({
    decimal_digits: "12",
  })
  @ApiProperty({
    description: "The balance of the account",
    example: 5.123456789,
  })
  balance: number;

  @Expose()
  @IsDecimal({
    decimal_digits: "12",
  })
  @ApiProperty({
    description: "The token balance of the account",
    example: 124532,
  })
  tokenBalance: number;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    description: "Whether the account balance is synced or not",
  })
  isBalanceSynced: boolean;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    description: "Whether the account token balance is synced or not",
  })
  isTokenBalanceSynced: boolean;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    description: "Whether the account token account is initialized or not",
  })
  isTokenAccountInitialized: boolean;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    description: "Whether the account is active or not",
  })
  isActive: boolean;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    description: "Whether the account is imported or not",
  })
  isImported: boolean;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    description: "Whether the account is removed or not",
  })
  isRemoved: boolean;

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
  @IsDate()
  @ApiProperty({
    description: "The date when the account was synced",
  })
  @ApiPropertyOptional()
  syncedAt?: Date  | null;

  @Expose()
  @IsDate()
  @ApiProperty({
    description:
      "System timestamp that indicates is there any problem with the account and syncing",
  })
  @ApiPropertyOptional()
  syncProblemInspectedAt?: Date  | null ;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "The date when the account was last bought",
  })
  @ApiPropertyOptional()
  lastBuyAt?: Date  | null;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "The date when the account was last sold",
  })
  @ApiPropertyOptional()
  lastSellAt?: Date  | null;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "The date when the account was removed",
  })
  @ApiPropertyOptional()
  removedAt?: Date  | null;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "The date when the account was exported",
  })
  @ApiPropertyOptional()
  exportedAt?: Date  | null;
}
