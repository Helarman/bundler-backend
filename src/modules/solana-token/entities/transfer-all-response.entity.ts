import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsArray } from "class-validator";

export class TransactionsResponseEntity {
  @Expose()
  @IsArray()
  @Type(() => String)
  @ApiProperty({
    description: "The transaction hashes of the transfers",
    example: ["txHash1", "txHash2"],
  })
  txHashes: string[];
}
