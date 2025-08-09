import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ImportAccountDto {
  @Expose()
  @ApiProperty({
    description: "The secret key of the account",
    example: "string | number[]",
  })
  secretKey: string | number[];
}
