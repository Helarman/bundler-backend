import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { $Enums, User, UserRole } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";

export interface IUserEntity extends Partial<Omit<User, "passwordHash">> {}
export class UserEntity implements IUserEntity {
  @Expose()
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: "The unique identifier of the user",
    example: "c24ef4b2-bd4a-4d5a-ae4c-d1b3ee1e4f4e",
  })
  id: string;

  email: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(3, 24)
  @ApiProperty({
    description: "The name of the user",
    example: "JohnDoe",
  })
  @ApiPropertyOptional()
  name?: string;

  @Expose()
  @IsEnum(UserRole)
  @ApiProperty({
    description: "The role of the user",
    example: UserRole.ADMIN,
    examples: [UserRole.ADMIN, UserRole.SYSTEM],
  })
  role: $Enums.UserRole;

  @Exclude()
  @IsString()
  passwordHash: string;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    description: "Whether the user is active or not",
  })
  isActive: boolean;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "The date when the user was created",
  })
  createdAt: Date;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "The date when the user was last updated",
  })
  updatedAt: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  @ApiProperty({
    description: "The date when the user was removed",
  })
  @ApiPropertyOptional()
  lastPasswordChangedAt?: Date;
}
