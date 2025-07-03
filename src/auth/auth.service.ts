import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto): Promise<TokensResponseDto> {
    const hash = await argon.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
      },
    });
    return this.signTokens(user.id, user.email);
  }

  async signin(dto: AuthDto): Promise<TokensResponseDto> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.signTokens(user.id, user.email);
  }

  async logout(userId: number): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshToken: { not: null },
      },
      data: { refreshToken: null },
    });
    return true;
  }

  async refreshTokens(userPayload: { email: string }): Promise<TokensResponseDto> {
    if (!userPayload?.email) {
      throw new UnauthorizedException('Email is missing in token');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: userPayload.email } // Ищем по email, а не по id
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.signTokens(user.id, user.email);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await argon.verify(user.password, pass)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private async signTokens(
    userId: number,
    email: string,
  ): Promise<TokensResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, email },
        {
          secret: this.config.get('JWT_ACCESS_SECRET'),
          expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN'),
        },
      ),
      this.jwt.signAsync(
        { sub: userId, email },
        {
          secret: this.config.get('JWT_REFRESH_SECRET'),
          expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
        },
      ),
    ]);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: await argon.hash(refreshToken) },
    });

    return { accessToken, refreshToken };
  }
}
