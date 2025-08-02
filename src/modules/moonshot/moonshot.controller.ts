import { Controller, Post, Body } from '@nestjs/common';
import { MoonshotService } from './moonshot.service';
import { CreateMoonshotDto } from './dto/create-moonshot.dto';
import { CreateMoonshotResponse } from './interfaces/create-moonshot-response.interface';

@Controller('moonshot')
export class MoonshotController {
  constructor(private readonly moonshotService: MoonshotService) {}

  @Post('create')
  async createMoonshot(@Body() dto: CreateMoonshotDto): Promise<CreateMoonshotResponse> {
    return this.moonshotService.createMoonshot(dto);
  }
}