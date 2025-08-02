import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { GetRouteQuoteDto, TradeAction } from './dto/get-route-quote.dto';
import { QuoteResponse } from './interfaces/quote-response.interface';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Get('buy')
  async getBuyQuote(
    @Query('tokenMintAddress') tokenMintAddress: string,
    @Query('solAmount') solAmount: string,
    @Query('rpcUrl') rpcUrl?: string,
  ): Promise<QuoteResponse> {
    const amount = parseFloat(solAmount);
    if (isNaN(amount)) {
      return {
        success: false,
        error: 'solAmount must be a valid number',
      };
    }

    return this.quoteService.getRouteQuote({
      tokenMintAddress,
      amount,
      action: TradeAction.BUY,
      rpcUrl,
    });
  }

  @Get('sell')
  async getSellQuote(
    @Query('tokenMintAddress') tokenMintAddress: string,
    @Query('tokenAmount') tokenAmount: string,
    @Query('rpcUrl') rpcUrl?: string,
  ): Promise<QuoteResponse> {
    const amount = parseFloat(tokenAmount);
    if (isNaN(amount)) {
      return {
        success: false,
        error: 'tokenAmount must be a valid number',
      };
    }

    return this.quoteService.getRouteQuote({
      tokenMintAddress,
      amount,
      action: TradeAction.SELL,
      rpcUrl,
    });
  }

  @Post('route')
  async getRouteQuote(@Body() dto: GetRouteQuoteDto): Promise<QuoteResponse> {
    return this.quoteService.getRouteQuote(dto);
  }
}