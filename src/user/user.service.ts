import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/user.dto';
import { UserResponseDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number): Promise<UserResponseDto> {
    if (!id) {
      throw new Error('User ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        rpcUrl: true,
        wssRpcUrl: true,
        devWallet: true,
        apiKey: true,
        transactionFee: true,
        isConfirmed: true,
        isSettingConfirmed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserResponseDto(user);
  }

  async updateUser(
    id: number,
    dto,
  ): Promise<UserResponseDto> {
    if (!id) {
      throw new Error('User ID is required');
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          rpcUrl: dto.rpcUrl,
          wssRpcUrl: dto.wssRpcUrl,
          devWallet: dto.devWallet,
        },
        select: {
          id: true,
          email: true,
          rpcUrl: true,
          wssRpcUrl: true,
          devWallet: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return new UserResponseDto(updatedUser);
    } catch (error) {
      if (error.code === 'P2025') {   
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
}