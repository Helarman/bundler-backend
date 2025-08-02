import { Injectable, Logger } from '@nestjs/common';
import { JetonService } from '../jeton/jeton.service';
import { GetRouteQuoteDto } from './dto/get-route-quote.dto';
import { QuoteResponse } from './interfaces/quote-response.interface';

@Injectable()
export class QuoteService {
  private readonly logger = new Logger(QuoteService.name);

  constructor(private readonly jetonService: JetonService) {}

  async getRouteQuote(dto: GetRouteQuoteDto): Promise<QuoteResponse> {
    this.logger.log('Getting route quote', {
      tokenMintAddress: dto.tokenMintAddress,
      amount: dto.amount,
      action: dto.action,
    });

    try {
      const result = await this.jetonService.getRouteQuote(
        dto.tokenMintAddress,
        dto.amount,
        dto.action,
        dto.rpcUrl,
      );

      if (result.success && result.result) {
        return {
          success: true,
          quote: result.result,
          message: 'Route quote retrieved successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to get route quote',
      };
    } catch (error) {
      this.logger.error('Route quote error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }
}