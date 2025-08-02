import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, VersionedTransaction } from '@solana/web3.js';
import { PrismaService } from '../../prisma.service';
import { UserService } from '../user/user.service';
import { SOLANA_CONFIG } from './constants/solana.constants';
import bs58 from 'bs58';
import { CreateTokenDto } from '../jeton/dto/create-token.dto';
import { TokenProgramService } from './token-program.service';
import { JitoService } from '../jito/jito.service';
import { JITO_CONFIG } from '../jito/constants/jito.constants';

@Injectable()
export class SolanaService implements OnModuleInit {
  private readonly logger = new Logger(SolanaService.name);
  private connection: Connection;
  private wsConnection: Connection;

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly tokenProgramService: TokenProgramService,
    private readonly jitoService: JitoService,
  ) {}

  async onModuleInit() {
    await this.initializeConnections();
  }

  private async initializeConnections() {
    try {
      // Get RPC URLs from the first user (or implement your own logic)
      const user = await this.prisma.user.findFirst();
      if (!user) {
        throw new Error('No user found in database to get RPC URLs');
      }

      this.connection = new Connection(user.rpcUrl || SOLANA_CONFIG.defaultRpcUrl, {
        commitment: SOLANA_CONFIG.commitment,
        disableRetryOnRateLimit: false,
      });

      this.wsConnection = new Connection(user.wssRpcUrl || SOLANA_CONFIG.defaultWssUrl, {
        commitment: SOLANA_CONFIG.commitment,
        wsEndpoint: user.wssRpcUrl || SOLANA_CONFIG.defaultWssUrl,
      });

      this.logger.log('Solana connections initialized', {
        rpcUrl: user.rpcUrl,
        wssUrl: user.wssRpcUrl,
      });
    } catch (error) {
      this.logger.error('Failed to initialize Solana connections', error);
      throw error;
    }
  }

  async getConnection(): Promise<Connection> {
    if (!this.connection) {
      await this.initializeConnections();
    }
    return this.connection;
  }

  async getWsConnection(): Promise<Connection> {
    if (!this.wsConnection) {
      await this.initializeConnections();
    }
    return this.wsConnection;
  }

  async createTokenTransactions(
    creatorKeypair: Keypair,
    config: CreateTokenDto,
    buyerWallets: string[]
  ): Promise<{ transactions: VersionedTransaction[]; mintAddress: string }> {
    try {
      this.logger.log('Creating token transactions', {
        creator: creatorKeypair.publicKey.toBase58(),
        buyerCount: buyerWallets.length,
      });

      // Create mint account
      const mintKeypair = Keypair.generate();
      const mintAddress = mintKeypair.publicKey.toBase58();

      // Create transactions
      const transactions: VersionedTransaction[] = [];

      // 1. Create mint account transaction
      const createMintTx = await this.tokenProgramService.createMintAccountTransaction(
        creatorKeypair.publicKey,
        mintKeypair.publicKey,
        creatorKeypair.publicKey,
        config.metadata.totalSupply
      );
      transactions.push(createMintTx);

      // 2. Initialize metadata transaction
      const initMetadataTx = await this.tokenProgramService.createInitializeMetadataTransaction(
        creatorKeypair.publicKey,
        mintKeypair.publicKey,
        creatorKeypair.publicKey,
        config.metadata
      );
      transactions.push(initMetadataTx);

      // 3. Create token accounts and transfer transactions for each buyer
      for (const buyerWallet of buyerWallets) {
        const buyerPublicKey = new PublicKey(buyerWallet);
        
        // Create associated token account if needed
        const createTokenAccountTx = await this.tokenProgramService.createAssociatedTokenAccountTransaction(
          creatorKeypair.publicKey,
          buyerPublicKey,
          mintKeypair.publicKey
        );
        transactions.push(createTokenAccountTx);

        // Mint tokens to buyer
        const mintToTx = await this.tokenProgramService.createMintToTransaction(
          creatorKeypair.publicKey,
          mintKeypair.publicKey,
          buyerPublicKey,
          config.defaultSolAmount
        );
        transactions.push(mintToTx);
      }

      return { transactions, mintAddress };
    } catch (error) {
      this.logger.error('Error creating token transactions', error);
      throw error;
    }
  }

  async signTransactions(
    transactions: VersionedTransaction[],
    signers: Keypair[]
  ): Promise<string[]> {
    try {
      this.logger.log('Signing transactions', {
        transactionCount: transactions.length,
        signerCount: signers.length,
      });

      const signedTransactions = transactions.map(tx => {
        // Add required signers
        tx.sign(signers);
        return bs58.encode(tx.serialize());
      });

      return signedTransactions;
    } catch (error) {
      this.logger.error('Error signing transactions', error);
      throw error;
    }
  }

  async sendTransactionsWithJito(transactions: string[]): Promise<string[]> {
    try {
      this.logger.log('Sending transactions with Jito', {
        transactionCount: transactions.length,
      });

      // Split transactions into bundles
      const bundleSize = JITO_CONFIG.maxBundleSize;
      const bundles: string[][] = [];

      for (let i = 0; i < transactions.length; i += bundleSize) {
        bundles.push(transactions.slice(i, i + bundleSize));
      }

      // Send each bundle
      const results: string[] = [];
      for (const bundle of bundles) {
        try {
          const result = await this.jitoService.sendBundle(bundle);
          if (result.error) {
            throw new Error(result.error.message);
          }
          results.push(result.result);
        } catch (error) {
          this.logger.warn('Failed to send bundle, retrying...', error);
          // Implement retry logic here
        }
      }

      return results;
    } catch (error) {
      this.logger.error('Error sending transactions with Jito', error);
      throw error;
    }
  }

  async getKeypairFromPrivateKey(privateKey: string): Promise<Keypair> {
    try {
      return Keypair.fromSecretKey(bs58.decode(privateKey));
    } catch (error) {
      this.logger.error('Error creating keypair from private key', error);
      throw new Error('Invalid private key');
    }
  }
}