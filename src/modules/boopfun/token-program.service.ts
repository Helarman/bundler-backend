import { Injectable, Logger } from '@nestjs/common';
import { 
  Connection, 
  Keypair, 
  PublicKey, 
  SystemProgram, 
  TransactionMessage,
  VersionedTransaction 
} from '@solana/web3.js';
import { CreateTokenDto } from '../jeton/dto/create-token.dto';
import { 
  TOKEN_PROGRAM_ID, 
  createInitializeMintInstruction, 
  createMintToInstruction, 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction 
} from '@solana/spl-token';
import { SolanaService } from './solana.service';
import { 
  CreateMetadataAccountV3InstructionAccounts, 
  CreateMetadataAccountV3InstructionArgs, 
  DataV2, 
  createMetadataAccountV3 
} from '@metaplex-foundation/mpl-token-metadata';
import { findMetadataPda } from '@metaplex-foundation/js';

@Injectable()
export class TokenProgramService {
  private readonly logger = new Logger(TokenProgramService.name);

  constructor(private readonly solanaService: SolanaService) {}

  async createMintAccountTransaction(
    payer: PublicKey,
    mint: PublicKey,
    mintAuthority: PublicKey,
    supply: string
  ): Promise<VersionedTransaction> {
    try {
      const connection = await this.solanaService.getConnection();
      const lamports = await connection.getMinimumBalanceForRentExemption(82);
      const { blockhash } = await connection.getLatestBlockhash();

      const message = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: blockhash,
        instructions: [
          SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: mint,
            space: 82,
            lamports,
            programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeMintInstruction(
            mint,
            9, // Decimals
            mintAuthority,
            null // Freeze authority
          )
        ],
      }).compileToV0Message();

      return new VersionedTransaction(message);
    } catch (error) {
      this.logger.error('Error creating mint account transaction', error);
      throw error;
    }
  }

async createInitializeMetadataTransaction(
  payer: PublicKey,
  mint: PublicKey,
  mintAuthority: PublicKey,
  metadata: { name: string; symbol: string; description: string; imageUrl: string }
): Promise<VersionedTransaction> {
  try {
    const connection = await this.solanaService.getConnection();
    const metadataAccount = findMetadataPda(mint);
    const { blockhash } = await connection.getLatestBlockhash();

    const metadataData: DataV2 = {
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.imageUrl,
        sellerFeeBasisPoints: 0,
        creators: {
            __option: 'None'
        },
        collection: {
            __option: 'None'
        },
        uses: {
            __option: 'None'
        }
    };

    const args: CreateMetadataAccountV3InstructionArgs = {
      data: metadataData,
      isMutable: true,
      collectionDetails: null,
    };

    const accounts = {
      metadata: metadataAccount,
      mint,
      mintAuthority,
      payer,
      updateAuthority: mintAuthority,
    };

    const context = {
      payer,
      programs: undefined, 
      eddsa: null as any,
      identity: null as any, 
    };

    const instruction = createMetadataAccountV3(
      context,
      {
        ...accounts,
        ...args
      }
    );

    const message = new TransactionMessage({
      payerKey: payer,
      recentBlockhash: blockhash,
      instructions: [instruction],
    }).compileToV0Message();

    return new VersionedTransaction(message);
  } catch (error) {
    this.logger.error('Error creating initialize metadata transaction', error);
    throw error;
  }
}

  async createAssociatedTokenAccountTransaction(
    payer: PublicKey,
    owner: PublicKey,
    mint: PublicKey
  ): Promise<VersionedTransaction> {
    try {
      const connection = await this.solanaService.getConnection();
      const associatedTokenAddress = await getAssociatedTokenAddress(mint, owner);
      const { blockhash } = await connection.getLatestBlockhash();

      const message = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: blockhash,
        instructions: [
          createAssociatedTokenAccountInstruction(
            payer,
            associatedTokenAddress,
            owner,
            mint
          )
        ],
      }).compileToV0Message();

      return new VersionedTransaction(message);
    } catch (error) {
      this.logger.error('Error creating associated token account transaction', error);
      throw error;
    }
  }

  async createMintToTransaction(
    authority: PublicKey,
    mint: PublicKey,
    destination: PublicKey,
    amount: number
  ): Promise<VersionedTransaction> {
    try {
      const connection = await this.solanaService.getConnection();
      const associatedTokenAddress = await getAssociatedTokenAddress(mint, destination);
      const { blockhash } = await connection.getLatestBlockhash();

      const message = new TransactionMessage({
        payerKey: authority,
        recentBlockhash: blockhash,
        instructions: [
          createMintToInstruction(
            mint,
            associatedTokenAddress,
            authority,
            amount * Math.pow(10, 9) 
          )
        ],
      }).compileToV0Message();

      return new VersionedTransaction(message);
    } catch (error) {
      this.logger.error('Error creating mint to transaction', error);
      throw error;
    }
  }
}