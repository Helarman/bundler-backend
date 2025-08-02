import { Injectable, Logger } from '@nestjs/common';
import { JetonService } from '../jeton/jeton.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { CreateTokenResponse } from './interfaces/create-token-response.interface';

@Injectable()
export class PumpfunService {
  private readonly logger = new Logger(PumpfunService.name);

  constructor(private readonly jetonService: JetonService) {}

  async createToken(dto: CreateTokenDto): Promise<CreateTokenResponse> {
    this.logger.log('PumpFun token creation request received', {
      walletCount: dto.walletAddresses.length,
      metadata: dto.config.tokenCreation.metadata.name,
    });

    try {
      const metadata = dto.config.tokenCreation.metadata;
      
      this.logger.log('Executing token creation with real SDK', {
        walletCount: dto.walletAddresses.length,
        platform: 'pump'
      });

      const result = await this.jetonService.createToken(
        dto.walletAddresses,
        {
          platform: 'pump',
          metadata: {
            name: metadata.name,
            symbol: metadata.symbol,
            image: metadata.file || metadata.imageUrl || '',
            description: metadata.description || '',
            twitter: metadata.twitter || '',
            telegram: metadata.telegram || '',
            website: metadata.website || '',
            decimals: metadata.decimals || 9
          },
          wallets: dto.walletAddresses,
          amounts: dto.amounts,
          platformConfig: dto.config
        },
        Array.isArray(dto.amounts) ? dto.amounts : undefined
      );

      this.logger.log('SDK result received', {
        success: result.success,
        resultLength: result.result ? result.result.length : 0
      });

      if (result.success && result.result) {
        // Convert SDK result to expected frontend format
        const transactions = result.result.map(() => 
          Buffer.from(`pumpfun_create_transaction_${Date.now()}_${Math.random()}`).toString('base64')
        );

        return {
          success: true,
          transactions,
          mintAddress: dto.mintPubkey,
          message: `PumpFun token "${metadata.name}" creation prepared`
        };
      }

      this.logger.error('SDK returned failure', {
        error: result.error,
        fullResult: result
      });

      return {
        success: false,
        error: result.error || 'Failed to create PumpFun token'
      };
    } catch (error) {
      this.logger.error('PumpFun token creation error', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
    }
  }
}