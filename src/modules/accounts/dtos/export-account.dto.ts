import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class ExportAccountDto {
  @Expose()
  @IsString()
  @ApiProperty({
    description: "Password of the current signed in account",
  })
  password: string;
}
