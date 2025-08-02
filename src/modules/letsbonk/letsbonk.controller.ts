import { 
  Controller, 
  Post, 
  Body, 
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LetsBonkService } from './letsbonk.service';
import { CreateLetsBonkDto } from './dto/create-letsbonk.dto';
import { LetsBonkResponseDto } from './dto/letsbonk-response.dto';

@ApiTags('LetsBonk')
@Controller('api/letsbonk')
export class LetsBonkController {
  private readonly logger = new Logger(LetsBonkController.name);

  constructor(private readonly letsBonkService: LetsBonkService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new LetsBonk transaction batch' })
  @ApiBody({ type: CreateLetsBonkDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Transactions prepared successfully',
    type: LetsBonkResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(
    @Body() createLetsBonkDto: CreateLetsBonkDto,
  ): Promise<LetsBonkResponseDto> {
    this.logger.debug('Received create LetsBonk request');
    return this.letsBonkService.createLetsBonk(createLetsBonkDto);
  }
}