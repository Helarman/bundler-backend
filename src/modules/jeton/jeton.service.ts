import { Injectable, Logger } from '@nestjs/common';
import { Keypair } from '@solana/web3.js';
import * as bs58 from 'bs58';
import {
  JetonSDK,
  buyTokenBatch,
  sellTokenBatch,
  createTokenSingle,
  transferTokens,
  burnToken,
  distributeSOL,
  consolidateSOL,
  getRouteQuote,
  validateTokenBuyInputs,
  validateTokenSellInputs,
  validateTokenCreateInputs,
  configure,
  
} from '../../../sdk'
import { TokenCreateConfig as SdkTokenCreateConfig } from '../../../sdk';
import { Wallet } from './interfaces/wallet.interface';
import { ApiResponse, BundleResult } from './interfaces/api-response.interface';
import { TokenBuyConfig, TokenCreateConfig, TokenSellConfig } from './interfaces/token-config.interface';
import { ValidationResult } from './interfaces/validation-result.interface';

@Injectable()
export class JetonService {
  private readonly logger = new Logger(JetonService.name);
  private sdk: JetonSDK | null = null;

  constructor() {
    this.initializeSDK();
  }

  private initializeSDK(): void {
    try {
      configure({
        apiUrl: process.env.API_URL || 'http://localhost:3000',
        baseUrl: process.env.BASE_URL || 'http://localhost:3000',
        rpcUrl: process.env.RPC_URL || 'https://api.mainnet-beta.solana.com',
        debug: process.env.NODE_ENV === 'development',
      });

      this.sdk = new JetonSDK({
        apiUrl: process.env.API_URL || 'http://localhost:3000',
        baseUrl: process.env.BASE_URL || 'http://localhost:3000',
        rpcUrl: process.env.RPC_URL || 'https://api.mainnet-beta.solana.com',
        debug: process.env.NODE_ENV === 'development',
      });

      this.logger.log('JetonSDK initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize JetonSDK', error);
      throw error;
    }
  }

  createPlaceholderWalletsFromAddresses(addresses: string[]): Wallet[] {
    return addresses.map(() => {
      const keypair = Keypair.generate();
      return { privateKey: bs58.encode(keypair.secretKey) };
    });
  }

  createWalletsFromPrivateKeys(privateKeys: string[]): Wallet[] {
    return privateKeys.map(privateKey => {
      try {
        Keypair.fromSecretKey(bs58.decode(privateKey));
        return { privateKey };
      } catch (error) {
        this.logger.warn('Invalid private key provided', error);
        throw new Error('Invalid private key format');
      }
    });
  }

  async buyTokens(
    walletAddresses: string[],
    tokenConfig: TokenBuyConfig,
    customAmounts?: number[],
  ): Promise<ApiResponse<BundleResult[][]>> {
    try {
      this.logger.log(
        `Buying tokens for ${walletAddresses.length} wallets`,
        tokenConfig,
      );

      const wallets = this.createPlaceholderWalletsFromAddresses(walletAddresses);
      const result = await buyTokenBatch(wallets, tokenConfig, customAmounts);

      this.logger.log('Token buy completed', {
        success: result.success,
        count: result.result?.length,
      });

      return result;
    } catch (error) {
      this.logger.error('Token buy failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sellTokens(
    walletAddresses: string[],
    tokenConfig: TokenSellConfig & { percentage: number },
    customPercentages?: number[],
  ): Promise<ApiResponse<BundleResult[][]>> {
    try {
      this.logger.log(
        `Selling tokens for ${walletAddresses.length} wallets`,
        tokenConfig,
      );

      const wallets = this.createPlaceholderWalletsFromAddresses(walletAddresses);
      const result = await sellTokenBatch(wallets, tokenConfig, customPercentages);

      this.logger.log('Token sell completed', {
        success: result.success,
        count: result.result?.length,
      });

      return result;
    } catch (error) {
      this.logger.error('Token sell failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async createToken(
    walletAddresses: string[],
    config: TokenCreateConfig,
    amounts?: number[],
  ): Promise<ApiResponse<BundleResult[]>> {
    try {
      this.logger.log(
        `Creating token for ${walletAddresses.length} wallets`,
        config,
      );

      const sdkConfig = this.adaptTokenCreateConfig(config)
      const wallets = this.createPlaceholderWalletsFromAddresses(walletAddresses);
      const result = await createTokenSingle(wallets, sdkConfig);

      this.logger.log('Token creation completed', {
        success: result.success,
      });

      return result;
    } catch (error) {
      this.logger.error('Token creation failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async transferTokens(
    senderPrivateKey: string,
    receiver: string,
    tokenAddress: string,
    amount: string,
  ): Promise<ApiResponse<BundleResult[]>> {
    try {
      this.logger.log('Transferring tokens', {
        receiver,
        tokenAddress,
        amount,
      });

      const senderWallet = { privateKey: senderPrivateKey };
      const result = await transferTokens(senderWallet, receiver, tokenAddress, amount);

      this.logger.log('Token transfer completed', {
        success: result.success,
      });

      return result;
    } catch (error) {
      this.logger.error('Token transfer failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async burnToken(
    walletPrivateKey: string,
    tokenAddress: string,
    amount: string,
  ): Promise<ApiResponse<BundleResult[]>> {
    try {
      this.logger.log('Burning tokens', {
        tokenAddress,
        amount,
      });

      const wallet = { privateKey: walletPrivateKey };
      const result = await burnToken(wallet, tokenAddress, amount);

      this.logger.log('Token burn completed', {
        success: result.success,
      });

      return result;
    } catch (error) {
      this.logger.error('Token burn failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async distributeSOL(
    senderAddress: string,
    recipients: Array<{ address: string; amount: string }>,
  ): Promise<ApiResponse<BundleResult[]>> {
    try {
      this.logger.log('Distributing SOL', {
        senderAddress,
        recipientCount: recipients.length,
      });

      const senderWallet = { privateKey: '' };
      const recipientWallets = recipients.map(recipient => ({
        privateKey: '',
        amount: recipient.amount,
      }));

      const result = await distributeSOL(senderWallet, recipientWallets);

      this.logger.log('SOL distribution completed', {
        success: result.success,
      });

      return result;
    } catch (error) {
      this.logger.error('SOL distribution failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async consolidateSOL(
    sourceAddresses: string[],
    receiverAddress: string,
    percentage: number,
  ): Promise<ApiResponse<BundleResult[]>> {
    try {
      this.logger.log('Consolidating SOL', {
        sourceCount: sourceAddresses.length,
        receiverAddress,
        percentage,
      });

      const sourceWallets = this.createPlaceholderWalletsFromAddresses(sourceAddresses);
      const receiverWallet = { privateKey: '' };
      const result = await consolidateSOL(sourceWallets, receiverWallet, percentage);

      this.logger.log('SOL consolidation completed', {
        success: result.success,
      });

      return result;
    } catch (error) {
      this.logger.error('SOL consolidation failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getRouteQuote(
    tokenMintAddress: string,
    amount: number,
    action: 'buy' | 'sell' = 'buy',
    rpcUrl?: string,
  ): Promise<ApiResponse<any>> {
    try {
      this.logger.log('Getting route quote', {
        tokenMintAddress,
        amount,
        action,
      });

      const result = await getRouteQuote({
        tokenMintAddress,
        amount,
        action,
        rpcUrl,
      });

      this.logger.log('Route quote completed', {
        success: result.success,
      });

      return result;
    } catch (error) {
      this.logger.error('Route quote failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private adaptTokenCreateConfig(config: TokenCreateConfig): SdkTokenCreateConfig {
    return {
      platform: config.options?.platform || 'pump', // значение по умолчанию
      metadata: {
        name: config.metadata.name,
        symbol: config.metadata.symbol,
        image: config.metadata.uri, // предполагаем, что `uri` в вашем конфиге = `image` в SDK
      },
      wallets: config.wallets.map(w => w.address), // преобразуем в массив адресов
      amounts: config.wallets.map(w => w.amount),  // преобразуем в массив amounts
    };
  }

  getSDK(): JetonSDK | null {
    return this.sdk;
  }

  validateTokenBuy(wallets: Wallet[], config: TokenBuyConfig): ValidationResult {
    return validateTokenBuyInputs(wallets, config);
  }

  validateTokenSell(wallets: Wallet[], config: TokenSellConfig): ValidationResult {
    return validateTokenSellInputs(wallets, config);
  }

  validateTokenCreate(wallets: Wallet[], config: TokenCreateConfig): ValidationResult {
    const sdkConfig = this.adaptTokenCreateConfig(config);
    return validateTokenCreateInputs(wallets, sdkConfig);
  }
}