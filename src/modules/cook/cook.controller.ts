import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CookService } from './cook.service';
import { CreateCookDto } from './dto/create-cook.dto';
import { CookResponseDto } from './dto/cook-response.dto';

@ApiTags('Cook')
@Controller('api/cook')
export class CookController {
  constructor(private readonly cookService: CookService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create cook transactions' })
  @ApiBody({ type: CreateCookDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Cook transactions prepared successfully',
    type: CookResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(
    @Body() createCookDto: CreateCookDto,
  ): Promise<CookResponseDto> {
    return this.cookService.createCook(createCookDto);
  }
}