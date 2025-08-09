import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  AccountInfo,
  Commitment,
  ComputeBudgetProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SignatureStatus,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { AppService } from "../../../app.service";
import { getMint } from "@solana/spl-token";
import { PrismaService } from "../../../prisma.service";
import { SolanaProviderService } from "./solana-provider.service";
import { Solana } from "../../@core/solana";

@Injectable()
export class SolanaService extends SolanaProviderService {
  private readonly logger = new Logger(SolanaService.name);

  constructor(
    configService: ConfigService,
    private readonly appService: AppService,
    private db: PrismaService,
  ) {
    super(configService);
  }

  async isTokenAccountExist(wallet: PublicKey): Promise<boolean> {
    const config = await this.appService.getConfig();
    
    if (!config){
      throw new InternalServerErrorException("App config not found");
    }

    const tokenAccount = await Solana.getWalletTokenAccount(
      wallet,
      new PublicKey(config.tokenId),
    );
     if (!tokenAccount){
  
      throw new InternalServerErrorException("Token account not found");
      return false;
    }
    try {
      const info = await this.connection!.getAccountInfo(tokenAccount);

      return !!info;
    } catch (error) {}

    return false;
  }

  async getTokenPublicKey(): Promise<string> {
    const config = await this.appService.getConfig();

    if (!config || config.tokenId.length < 10) {
      throw new InternalServerErrorException("App config not found");
    }

    return config.tokenId;
  }

  async getToken() {
    const config = await this.appService.getConfig();

    if (!config || config.tokenId.length < 10) {
      throw new InternalServerErrorException("App config not found");
    }

    const publicKey = new PublicKey(config.tokenId);

    return {
      publicKey,
      mint: await getMint(this.connection!, publicKey),
    };
  }

  async transferSolana(
    owner: Keypair,
    recipient: PublicKey,
    amount: number,
    priorityMicroLamptorsFee?: number,
    ignoreRecipientNotFound?: boolean,
  ) {
    const recipientInfo = await this.connection!.getAccountInfo(recipient);

    if (!recipientInfo && !ignoreRecipientNotFound) {
      throw new BadRequestException("Recipient account not found");
    }

    const lamports = BigInt(Math.floor(amount * LAMPORTS_PER_SOL));

    const instructions: TransactionInstruction[] = [
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 5000,
      }),
      ...(priorityMicroLamptorsFee
        ? [
            ComputeBudgetProgram.setComputeUnitPrice({
              microLamports: priorityMicroLamptorsFee,
            }),
          ]
        : []),
      SystemProgram.transfer({
        fromPubkey: owner.publicKey,
        toPubkey: recipient,
        lamports,
      }),
    ];

    const blockHash = await this.connection!.getLatestBlockhash("finalized");
    const transaction = new VersionedTransaction(
      new TransactionMessage({
        payerKey: owner.publicKey,
        recentBlockhash: blockHash.blockhash,
        instructions,
      }).compileToV0Message(),
    );

    transaction.sign([owner]);

    const txHash = await this.connection!.sendTransaction(transaction);

    return txHash;
  }

  /**
   * Get signatures for all tx hashes with chunking implementation
   * @param txHashes Tx hashes to get signatures for
   * @param chunkSize Chunk size
   * @param rpcUrl RPC url (by default Solana mainnet)
   * @returns
   */
  async getTxsStatuses({
    txHashes,
    connection = new Connection(SolanaProviderService.prodRpcUrl),
    chunkSize = 256,
  }: {
    txHashes: string[];
    connection?: Connection;
    chunkSize?: number;
  }) {
    const chunkedTxHashes: Array<string[]> = [];
    const signatures: SignatureStatus[] = [];

    for (let i = 0; i < txHashes.length; i += chunkSize) {
      chunkedTxHashes.push(txHashes.slice(i, i + chunkSize));
    }

  for (const chunk of chunkedTxHashes) {
    const { value: chunkSignatures } = await connection.getSignatureStatuses(chunk);
    
    const validSignatures = chunkSignatures.filter(
      (sig): sig is SignatureStatus => sig !== null
    );
    
    signatures.push(...validSignatures);
  }

    return txHashes.reduce(
      (acc, txHash, index) => {
        const status = signatures?.[index];

        return [
          ...acc,
          {
            txHash,
            status: status ?? null,
          },
        ];
      },
      [] as {
        txHash: string;
        status: SignatureStatus | null;
      }[],
    );
  }

  /**
   * Gets info about accounts with RPC request and chunking implementation
   * @param accountIds Ids of the accounts to get info
   * @returns
   */
  public async getAccountsInfo({
    accountIds,
    connection = new Connection(SolanaProviderService.prodRpcUrl),
    commitment,
    chunkSize = 100,
  }: {
    accountIds: string[];
    connection?: Connection;
    commitment?: Commitment;
    chunkSize?: number;
  }) {
    const chunkedAccounts: Array<string[]> = [];

    const accountsInfo = accountIds.reduce(
      (acc, curr) => {
        acc[curr] = null;
        return acc;
      },
      {} as Record<string, AccountInfo<Buffer> | null>,
    );

    for (let i = 0; i < accountIds.length; i += chunkSize) {
      chunkedAccounts.push(accountIds.slice(i, i + chunkSize));
    }

    /**
     * We need chunking because getMultipleAccountsInfo have limitations
     * For solana mainnet we can't get more than 100 accounts at once
     * At free tier of Quicknode only 5 accounts can be requested at once
     */
    for (const chunk of chunkedAccounts) {
      const chunkInfo = await connection.getMultipleAccountsInfo(
        chunk.map((a) => new PublicKey(a)),
        commitment,
      );

      for (let i = 0; i < chunk.length; i++) {
        const accountId = chunk[i];
        const info = chunkInfo?.[i];

        if (!info) continue;

        accountsInfo[accountId] = info;
      }
    }

    return Object.entries(accountsInfo).map(([accountId, info]) => ({
      accountId,
      info,
    }));
  }
}
