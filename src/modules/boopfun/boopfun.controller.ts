import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BoopFunService } from './boopfun.service';
import { CreateBoopFunDto } from './dto/create-boopfun.dto';
import { BoopFunResponseDto } from './dto/boopfun-response.dto';

@ApiTags('BoopFun')
@Controller('api/boopfun')
export class BoopFunController {
  constructor(private readonly boopFunService: BoopFunService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create BoopFun transactions' })
  @ApiBody({ type: CreateBoopFunDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'BoopFun transactions prepared successfully',
    type: BoopFunResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(
    @Body() createBoopFunDto: CreateBoopFunDto,
  ): Promise<BoopFunResponseDto> {
    return this.boopFunService.createBoopFun(createBoopFunDto);
  }
}