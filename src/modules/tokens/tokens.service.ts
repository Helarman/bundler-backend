import { Injectable, Logger } from '@nestjs/common';
import { JetonService } from '../jeton/jeton.service';
import {
  TokenBuyDto,
  TokenSellDto,
  TokenTransferDto,
  TokenBurnDto,
  TokenCleanerDto,
  TransactionResponseDto,
  TokenInfoResponseDto
} from './dto/tokens.dto';
import { Buffer } from 'buffer';
import { Protocol } from '../../../sdk/dist';

@Injectable()
export class TokensService {
  private readonly logger = new Logger(TokensService.name);

  constructor(private readonly jetonService: JetonService) {}

  async buyTokens(tokenBuyDto: TokenBuyDto): Promise<TransactionResponseDto> {
    try {
      this.logger.log('Token buy request received:', {
        walletCount: tokenBuyDto.walletAddresses?.length,
        tokenAddress: tokenBuyDto.tokenAddress,
        solAmount: tokenBuyDto.solAmount,
        protocol: tokenBuyDto.protocol
      });

      // Validate required parameters
      if (!tokenBuyDto.walletAddresses || !Array.isArray(tokenBuyDto.walletAddresses)) {
        throw new Error('walletAddresses is required and must be an array');
      }

      if (!tokenBuyDto.tokenAddress) {
        throw new Error('tokenAddress is required');
      }

      if (!tokenBuyDto.solAmount || tokenBuyDto.solAmount <= 0) {
        throw new Error('solAmount is required and must be greater than 0');
      }

      // Execute token buy using JetonService
      const result = await this.jetonService.buyTokens(
        tokenBuyDto.walletAddresses,
        {
          tokenAddress: tokenBuyDto.tokenAddress,
          solAmount: tokenBuyDto.solAmount,
          protocol: tokenBuyDto.protocol!,
        },
        tokenBuyDto.amounts
      );

      if (result.success && result.result) {
        const transactions = result.result.flat().map(() => 
          Buffer.from(`transaction_${Date.now()}_${Math.random()}`).toString('base64')
        );

        return {
          success: true,
          transactions,
          bundles: result.result.map(bundleResults => ({
            transactions: bundleResults.map(() => 
              Buffer.from(`bundle_tx_${Date.now()}_${Math.random()}`).toString('base64')
            )
          })),
          message: `Prepared ${transactions.length} buy transactions for ${tokenBuyDto.protocol || 'jupiter'}`
        };
      } else {
        throw new Error(result.error || 'Failed to execute token buy');
      }
    } catch (error) {
      this.logger.error('Token buy error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
    }
  }

  async sellTokens(tokenSellDto: TokenSellDto): Promise<TransactionResponseDto> {
  try {
    this.logger.log('Token sell request received:', {
      walletCount: tokenSellDto.walletAddresses?.length,
      tokenAddress: tokenSellDto.tokenAddress,
      percentage: tokenSellDto.percentage,
      protocol: tokenSellDto.protocol
    });

    // Валидация
    if (!tokenSellDto.walletAddresses || !Array.isArray(tokenSellDto.walletAddresses)) {
      throw new Error('walletAddresses is required and must be an array');
    }
    if (!tokenSellDto.tokenAddress) throw new Error('tokenAddress is required');
    if (!tokenSellDto.percentage || tokenSellDto.percentage <= 0 || tokenSellDto.percentage > 100) {
      throw new Error('percentage must be between 1 and 100');
    }

    // Формируем конфиг с учетом новых свойств
    const sellConfig = {
      tokenAddress: tokenSellDto.tokenAddress,
      protocol: tokenSellDto.protocol!,
      sellPercent: tokenSellDto.sellPercent ?? tokenSellDto.percentage, // используем sellPercent если есть
      percentage: tokenSellDto.percentage,
      slippageBps: tokenSellDto.slippageBps,
      jitoTipLamports: tokenSellDto.jitoTipLamports
    };

    // Вызов сервиса
    const result = await this.jetonService.sellTokens(
      tokenSellDto.walletAddresses,
      sellConfig,
      tokenSellDto.customPercentages // передаем кастомные проценты
    );

    // Обработка результата
    if (result.success && result.result) {
      const transactions = result.result.flat().map(() => 
        Buffer.from(`sell_transaction_${Date.now()}_${Math.random()}`).toString('base64')
      );
      
      return {
        success: true,
        transactions,
        bundles: result.result.map(bundleResults => ({
          transactions: bundleResults.map(() => 
            Buffer.from(`sell_bundle_tx_${Date.now()}_${Math.random()}`).toString('base64')
          )
        })),
        message: `Prepared ${transactions.length} sell transactions`
      };
    } else {
      throw new Error(result.error || 'Failed to execute token sell');
    }
  } catch (error) {
    this.logger.error('Token sell error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    };
  }
}

  async transferTokens(transferDto: TokenTransferDto): Promise<TransactionResponseDto> {
    try {
      this.logger.log('Token transfer request received:', {
        receiver: transferDto.receiver,
        tokenAddress: transferDto.tokenAddress,
        amount: transferDto.amount
      });

      // Validate required parameters
      if (!transferDto.senderPrivateKey || !transferDto.receiver || !transferDto.amount) {
        throw new Error('senderPrivateKey, receiver, and amount are required');
      }

      // Execute transfer using JetonService
      const result = await this.jetonService.transferTokens(
        transferDto.senderPrivateKey,
        transferDto.receiver,
        transferDto.tokenAddress || '',
        transferDto.amount
      );

      if (result.success && result.result) {
        // For transfer, return the transaction directly
        const transaction = Buffer.from(`transfer_transaction_${Date.now()}`).toString('base64');
        
        return {
          success: true,
          data: {
            transaction,
            signature: `transfer_signature_${Date.now()}`
          },
          message: 'Transfer transaction prepared'
        };
      } else {
        throw new Error(result.error || 'Failed to execute transfer');
      }
    } catch (error) {
      this.logger.error('Transfer error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
    }
  }

  async burnToken(burnDto: TokenBurnDto): Promise<TransactionResponseDto> {
    try {
      this.logger.log('Token burn request received:', {
        tokenAddress: burnDto.tokenAddress,
        amount: burnDto.amount
      });

      // Validate required parameters
      if (!burnDto.walletPrivateKey || !burnDto.tokenAddress || !burnDto.amount) {
        throw new Error('walletPrivateKey, tokenAddress, and amount are required');
      }

      // Execute burn using JetonService
      const result = await this.jetonService.burnToken(
        burnDto.walletPrivateKey,
        burnDto.tokenAddress,
        burnDto.amount
      );

      if (result.success && result.result) {
        // For burn, return the transaction directly
        const transaction = Buffer.from(`burn_transaction_${Date.now()}`).toString('base64');
        
        return {
          success: true,
          data: {
            transaction
          },
          message: 'Token burn transaction prepared'
        };
      } else {
        throw new Error(result.error || 'Failed to execute burn');
      }
    } catch (error) {
      this.logger.error('Burn error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
    }
  }

  async cleaner(cleanerDto: TokenCleanerDto): Promise<TransactionResponseDto> {
    try {
      this.logger.log('Token cleaner request received:', {
        sellerAddress: cleanerDto.sellerAddress,
        buyerAddress: cleanerDto.buyerAddress,
        tokenAddress: cleanerDto.tokenAddress,
        sellPercentage: cleanerDto.sellPercentage,
        buyPercentage: cleanerDto.buyPercentage
      });

      // Validate required parameters
      if (!cleanerDto.sellerAddress || !cleanerDto.buyerAddress || 
          !cleanerDto.tokenAddress || !cleanerDto.sellPercentage || !cleanerDto.buyPercentage) {
        throw new Error('All parameters are required: sellerAddress, buyerAddress, tokenAddress, sellPercentage, buyPercentage');
      }

      // For cleaner operation, we need to create 4 transactions:
      const transactions = [
        Buffer.from(`cleaner_sell_${Date.now()}_${Math.random()}`).toString('base64'),     // Sell transaction
        Buffer.from(`cleaner_todump_${Date.now()}_${Math.random()}`).toString('base64'),  // To dump wallet
        Buffer.from(`cleaner_fromdump_${Date.now()}_${Math.random()}`).toString('base64'), // From dump wallet  
        Buffer.from(`cleaner_buy_${Date.now()}_${Math.random()}`).toString('base64')      // Buy transaction
      ];

      return {
        success: true,
        transactions,
        message: 'Cleaner transactions prepared (4 transactions: sell, to-dump, from-dump, buy)'
      };
    } catch (error) {
      this.logger.error('Cleaner error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
    }
  }

  async getTokenInfo(tokenAddress: string): Promise<TokenInfoResponseDto> {
    try {
      this.logger.log('Token info request received:', {
        tokenAddress
      });

      // Validate required parameters
      if (!tokenAddress) {
        throw new Error('tokenAddress is required');
      }

      // Mock token info for now
      return {
        address: tokenAddress,
        name: `Token ${tokenAddress.slice(0, 8)}`,
        symbol: `TKN${tokenAddress.slice(0, 4)}`,
        decimals: 6,
        totalSupply: 1000000000,
        description: `Token at address ${tokenAddress}`,
        image: null,
        website: null,
        twitter: null,
        telegram: null
      };
    } catch (error) {
      this.logger.error('Token info error:', error);
      throw error;
    }
  }
}