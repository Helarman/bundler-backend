import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { TokensService } from './tokens.service';
import { 
  TokenBuyDto, 
  TokenSellDto, 
  TokenTransferDto, 
  TokenBurnDto, 
  TokenCleanerDto,
  TransactionResponseDto,
  TokenInfoResponseDto
} from './dto/tokens.dto';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post('buy')
  async buy(@Body() tokenBuyDto: TokenBuyDto): Promise<TransactionResponseDto> {
    const result = await this.tokensService.buyTokens(tokenBuyDto);
    if (!result.success) {
      throw new HttpException(result, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('sell')
  async sell(@Body() tokenSellDto: TokenSellDto): Promise<TransactionResponseDto> {
    const result = await this.tokensService.sellTokens(tokenSellDto);
    if (!result.success) {
      throw new HttpException(result, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('transfer')
  async transfer(@Body() transferDto: TokenTransferDto): Promise<TransactionResponseDto> {
    const result = await this.tokensService.transferTokens(transferDto);
    if (!result.success) {
      throw new HttpException(result, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('burn')
  async burn(@Body() burnDto: TokenBurnDto): Promise<TransactionResponseDto> {
    const result = await this.tokensService.burnToken(burnDto);
    if (!result.success) {
      throw new HttpException(result, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('cleaner')
  async cleaner(@Body() cleanerDto: TokenCleanerDto): Promise<TransactionResponseDto> {
    const result = await this.tokensService.cleaner(cleanerDto);
    if (!result.success) {
      throw new HttpException(result, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Get('info/:tokenAddress')
  async getTokenInfo(@Param('tokenAddress') tokenAddress: string): Promise<TokenInfoResponseDto> {
    try {
      return await this.tokensService.getTokenInfo(tokenAddress);
    } catch (error) {
      throw new HttpException({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }, HttpStatus.BAD_REQUEST);
    }
  }
}