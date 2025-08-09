import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from './decorators/public.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: AuthDto): Promise<TokensResponseDto> {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthDto): Promise<TokensResponseDto> {
    return this.authService.signin(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @CurrentUser() user: { email: string },
  ): Promise<TokensResponseDto> {
    return this.authService.refreshTokens(user);
  }
}