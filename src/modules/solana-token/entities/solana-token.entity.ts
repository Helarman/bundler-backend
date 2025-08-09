import { ITokenData } from "../../@core/solana/pump.fun/token";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class SolanaTokenDataEntity implements ITokenData {
  @Expose()
  @IsString()
  @ApiProperty({
    description: "The public key of the token",
    example: "So11111111111111111111111111111111111111112",
  })
  mint: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The name of the token",
    example: "Solana",
  })
  name: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The symbol of the token",
    example: "SOL",
  })
  symbol: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The description of the token",
    example:
      "Solana is a blockchain that allows you to build and run applications on its network.",
  })
  description: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The image of the token",
    example: "https://solana.com/wp-content/uploads/2022/01/solana-logo.png",
  })
  image_uri: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The metadata of the token",
    example: "https://solana.com/wp-content/uploads/2022/01/solana-logo.png",
  })
  metadata_uri: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "The Twitter handle of the token",
    example: "@solana",
    nullable: true,
  })
  twitter: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "The Telegram group of the token",
    example: "https://t.me/solana",
    nullable: true,
  })
  telegram: string | null;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The bonding curve address of the token",
    example: "6QzTnHVtirQoFESMfruoErj63VdQ1Mwug8ku7cozE7zh",
  })
  bonding_curve: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The associated bonding curve address of the token",
    example: "9W5RLtqDUPUFRHBBqAtULufGLEmjUZeS1wLKUFXhNSfg",
  })
  associated_bonding_curve: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The creator's address",
    example: "CJCPJNLB9R3nWcetzZ3XqUNNpgG8FT1ud37zMYNcKZn4",
  })
  creator: string;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The creation timestamp",
    example: 1718270774645,
  })
  created_timestamp: number;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "The Raydium pool address",
    example: "RaydiumPoolAddress",
    nullable: true,
  })
  raydium_pool: string | null;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    description: "Indicates if the token data is complete",
    example: false,
  })
  complete: boolean;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The virtual Solana reserves",
    example: 30100362525,
  })
  virtual_sol_reserves: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The virtual token reserves",
    example: 1069422363776860,
  })
  virtual_token_reserves: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The total supply of the token",
    example: 1000000000000000,
  })
  total_supply: number;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "The website of the token",
    example: "https://solana.com",
    nullable: true,
  })
  website: string | null;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    description: "Indicates if the token name should be shown",
    example: true,
  })
  show_name: boolean;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: "The King of the Hill timestamp",
    example: 1718270774645,
    nullable: true,
  })
  king_of_the_hill_timestamp: number | null;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The market cap of the token",
    example: 28.146374664,
  })
  market_cap: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The reply count of the token",
    example: 2,
  })
  reply_count: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The last reply timestamp",
    example: 1719166751503,
  })
  last_reply: number;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    description: "Indicates if the token is NSFW",
    example: false,
  })
  nsfw: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "The market ID",
    example: "MarketID",
    nullable: true,
  })
  market_id: string | null;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: "Indicates if the token is inverted",
    example: false,
    nullable: true,
  })
  inverted: boolean | null;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The username of the creator",
    example: "ASATIANI",
  })
  username: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The profile image URI",
    example:
      "https://cf-ipfs.com/ipfs/QmZjkUUwxnMJqJ5q2Zre7iNUgS9Puew3Z6tazsLqcErKBL",
  })
  profile_image: string;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The USD market cap of the token",
    example: 3563.61249620904,
  })
  usd_market_cap: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The solana price per token",
    example: 0.001,
  })
  solana_price_per_token: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "The USD price per token",
    example: 0.001,
  })
  usd_price_per_token: number;
}
