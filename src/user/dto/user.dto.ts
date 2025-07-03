import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  rpcUrl?: string;

  @IsOptional()
  @IsString()
  wssRpcUrl?: string;

  @IsOptional()
  @IsString()
  devWallet?: string;
}

export class UserResponseDto {
  id: number;
  email: string;
  rpcUrl?: string;
  wssRpcUrl?: string;
  devWallet?: string;
  isSettingConfirmed?: boolean;
  isConfirmed?: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: {
    id: number;
    email: string;
    rpcUrl?: string;
    wssRpcUrl?: string;
    devWallet?: string;
    isSettingConfirmed?: boolean;
    isConfirmed?: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = user.id;
    this.email = user.email;
    this.rpcUrl = user.rpcUrl;
    this.wssRpcUrl = user.wssRpcUrl;
    this.devWallet = user.devWallet;
    this.isSettingConfirmed = user.isSettingConfirmed;
    this.isConfirmed = user.isConfirmed;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}