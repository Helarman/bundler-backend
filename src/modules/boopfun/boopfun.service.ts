import { Injectable, Logger } from '@nestjs/common';
import { CreateBoopFunDto } from './dto/create-boopfun.dto';
import { BoopFunResponseDto } from './dto/boopfun-response.dto';
import { SolanaService } from './solana.service';
import bs58 from 'bs58';
import { Keypair } from '@solana/web3.js';

@Injectable()
export class BoopFunService {
  private readonly logger = new Logger(BoopFunService.name);

  constructor(private readonly solanaService: SolanaService) {}

  async createBoopFun(createBoopFunDto: CreateBoopFunDto): Promise<BoopFunResponseDto> {
    try {
      const { config, buyerWallets } = createBoopFunDto;
      this.logger.log('Creating BoopFun token', {
        tokenName: config.tokenCreation.metadata.name,
        buyerCount: buyerWallets.length,
      });

      if (buyerWallets.length === 0) {
        throw new Error('At least one buyer wallet is required');
      }

      
      const creatorKeypair = await this.solanaService.getKeypairFromPrivateKey(buyerWallets[0]);

      
      const { transactions, mintAddress } = await this.solanaService.createTokenTransactions(
        creatorKeypair,
        config.tokenCreation,
        buyerWallets.slice(1) 
      );

      
      const signers = [creatorKeypair];

      const signedTransactions = await this.solanaService.signTransactions(transactions, signers);

      const results = await this.solanaService.sendTransactionsWithJito(signedTransactions);

      return {
        success: true,
        transactions: signedTransactions,
        mintAddress,
        message: 'BoopFun token created successfully',
      };
    } catch (error) {
      this.logger.error('Error creating BoopFun token', error);
      return {
        success: false,
        message: 'Failed to create BoopFun token',
      };
    }
  }


}