import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(
    @CurrentUser('id') userId: number,
  ): Promise<UserResponseDto> {
    return this.userService.getUserById(userId);
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  async updateCurrentUser(
    @CurrentUser('id') userId: number,
    @Body() dto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(userId, dto);
  }
}