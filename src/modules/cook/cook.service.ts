import { Injectable, Logger } from '@nestjs/common';
import { CreateCookDto } from './dto/create-cook.dto';
import { CookResponseDto } from './dto/cook-response.dto';

@Injectable()
export class CookService {
  private readonly logger = new Logger(CookService.name);

  async createCook(createCookDto: CreateCookDto): Promise<CookResponseDto> {
    const { config, buyerWallets } = createCookDto;

    this.logRequest(config, buyerWallets);

    const mockTransactions = this.generateMockTransactions(buyerWallets);

    return {
      success: true,
      transactions: mockTransactions,
      message: 'Cook creation transactions prepared',
    };
  }

  private logRequest(config: { tokenMetadata: { name: string } }, buyerWallets: string[]): void {
    this.logger.log('Cook create request received', {
      tokenName: config?.tokenMetadata?.name,
      buyerCount: buyerWallets?.length,
    });
  }

  private generateMockTransactions(buyerWallets: string[]): string[] {
    return buyerWallets.map((_, index) => `mock_cook_tx_${Date.now()}_${index}`);
  }
}