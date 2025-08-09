import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export interface ISolanaTransactionEntity {
  txHash: string;
}

export class SolanaTransactionEntity implements ISolanaTransactionEntity {
  @Expose()
  @IsString()
  @ApiProperty({
    description: "The transaction hash",
  })
  txHash: string;
}
