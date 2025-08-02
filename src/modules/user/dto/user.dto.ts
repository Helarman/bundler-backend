import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rpcUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  wssRpcUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  devWallet?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  apiKey?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  transactionFee?: number;
}

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rpcUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  wssRpcUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  devWallet?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  apiKey?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  transactionFee?: number;

  @ApiProperty()
  @IsBoolean()
  isConfirmed: boolean;

  @ApiProperty()
  @IsBoolean()
  isSettingConfirmed: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.rpcUrl = user.rpcUrl;
    this.wssRpcUrl = user.wssRpcUrl;
    this.devWallet = user.devWallet;
    this.apiKey = user.apiKey;
    this.transactionFee = user.transactionFee;
    this.isConfirmed = user.isConfirmed;
    this.isSettingConfirmed = user.isSettingConfirmed;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}