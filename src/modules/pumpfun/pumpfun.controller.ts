import { Controller, Post, Body } from '@nestjs/common';
import { PumpfunService } from './pumpfun.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { CreateTokenResponse } from './interfaces/create-token-response.interface';

@Controller('pumpfun')
export class PumpfunController {
  constructor(private readonly pumpfunService: PumpfunService) {}

  @Post('create')
  async createToken(@Body() dto: CreateTokenDto): Promise<CreateTokenResponse> {
    return this.pumpfunService.createToken(dto);
  }
}