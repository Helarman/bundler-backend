import { Solana } from "../@core/solana";
import { PumpFun } from "../@core/solana/pump.fun";
import { ITokenData, PumpFunToken } from "../@core/solana/pump.fun/token";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OnEvent } from "@nestjs/event-emitter";
import { Cron, CronExpression } from "@nestjs/schedule";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  MintLayout,
} from "@solana/spl-token";
import {
  BlockhashWithExpiryBlockHeight,
  Commitment,
  ComputeBudgetProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  RpcResponseAndContext,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { AccountsService } from "../accounts/services/accounts.service";
import { AppConfigUpdatedEvent } from "../../app.events";
import { AppService } from "../../app.service";
import { CreatePumpFunTokenDto } from "./dtos/create-spl.dto";
import { SolanaProviderService } from "../solana/services/solana-provider.service";
import { SolanaService } from "../solana/services/solana.service";
import * as bs58 from "bs58";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { sleep } from "../@core/utils/sleep";

export const GLOBAL_ACCOUNT_SEED = "global";
export const MINT_AUTHORITY_SEED = "mint-authority";
export const BONDING_CURVE_SEED = "bonding-curve";
export const METADATA_SEED = "metadata";

@Injectable()
export class SolanaTokenService extends SolanaProviderService {
  private readonly logger = new Logger(SolanaTokenService.name);
  private token: PumpFunToken | null = null;
  public tokenData: ITokenData | null = null;

  constructor(
    configService: ConfigService,
    private readonly appService: AppService,
    private readonly solanaService: SolanaService,
    private readonly accountsService: AccountsService,
  ) {
    super(configService);
  }

  async onModuleInit() {
    await super.onModuleInit();
    await this.syncTokenData();
  }

  @OnEvent(AppConfigUpdatedEvent.id)
  private async onAppConfigUpdated() {
    this.token = null;
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  private async syncTokenData() {
    try {
      const token = await this.getToken();
      this.tokenData = await token.getData();
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * Get token instance
   * @returns
   */
  async getToken() {
    if (this.token) return this.token;

    const config = await this.appService.getConfig();

    this.logger.debug(`Parsing token data for cache it then`);

    const token = new PumpFunToken(this.connection!, config!.tokenId, {
      id: config!.bondingCurveId,
      associatedId: config!.associatedBondingCurveId,
    });

    // to cache it
    await token.getDecimals();

    this.token = token;

    return token;
  }

  async calculateMinSolOutput(tokenAmount: number, slipPagePercent = 5) {
    const slippageDecimals = slipPagePercent / 100;
    const solAmount = await this.tokenToSolAmount(tokenAmount);

    const minSolOuput = solAmount * (1 - slippageDecimals);

    this.logger.debug(
      `Calculated min sol output ${minSolOuput} for ${tokenAmount} token amount with slippage ${slipPagePercent}%`,
    );

    return minSolOuput;
  }

  async solToTokenAmount(solAmount = 1) {
    const token = await this.getToken();
    const decimals = await token.getDecimals();
    if (!this.tokenData) {
        throw new Error('tokenData is null');
    }
    const { virtual_token_reserves, virtual_sol_reserves } = this.tokenData;

    const tokenAmount =
      (solAmount * LAMPORTS_PER_SOL * virtual_token_reserves) /
      virtual_sol_reserves /
      10 ** decimals;

    PumpFun.logger.debug(
      `Converted ${solAmount} SOL amount to ${tokenAmount} token amount`,
    );

    return tokenAmount;
  }

  async tokenToSolAmount(tokenAmount = 1) {
    const token = await this.getToken();
    const decimals = await token.getDecimals();

    if (!this.tokenData) {
        throw new Error('tokenData is null');
    }
    const { virtual_token_reserves, virtual_sol_reserves } = this.tokenData;

    const tokenFullAmount = tokenAmount * 10 ** decimals;
    const solAmountPerToken =
      virtual_sol_reserves / LAMPORTS_PER_SOL / virtual_token_reserves;

    this.logger.debug(
      `Converted ${tokenAmount} token amount to ${tokenFullAmount * solAmountPerToken} SOL amount`,
    );

    return tokenFullAmount * solAmountPerToken;
  }

  /**
   * Get balance of the tokens on wallet
   * @param walletId Id of the wallet
   * @returns
   */
  override async getBalance(walletId: string): Promise<number> {
    const token = await this.getToken();

    return token.getSPLBalance(new PublicKey(walletId));
  }

  private async _sendTxWithRetry(
    connection: Connection,
    transaction: VersionedTransaction,
    retryDelay: 50,
    maxRetries = 15,
  ) {
    let txHash = "";

    for (const index of Array.from({ length: maxRetries })) {
      index;

      try {
        txHash = await connection.sendRawTransaction(transaction.serialize(), {
          skipPreflight: true,
        });
      } catch (error) {
        this.logger.error(error);
      }

      if (txHash.indexOf("111111111111111111") > -1) {
        txHash = "";
      }

      if (txHash.length > 0) break;

      await sleep(retryDelay);
    }

    return txHash;
  }

  private async _buyTokenFromAccounts(
    connection: Connection,
    commitment: Commitment,
    provider: AnchorProvider,
    _blockHash: BlockhashWithExpiryBlockHeight,
    mint: PublicKey,
    bondingCurve: PublicKey,
    accounts: { buyer: Keypair; solAmount: number }[],
  ) {
    const globalAccount = await PumpFun.getGlobalAccount(connection);
    const blockHash = await connection.getLatestBlockhash(commitment);

    const transactions: VersionedTransaction[] = [];

    for (const { buyer, solAmount } of accounts) {
      const slippagePercent = 50;
      const slippageDecimals = slippagePercent / 100;
      const tokenAmount = globalAccount.getInitialBuyPrice(
        BigInt(Math.floor(solAmount * LAMPORTS_PER_SOL)),
      );

      const tokenAmountWithSlippage = BigInt(
        Math.max(
          Math.floor(
            Number(tokenAmount) - Number(tokenAmount) * slippageDecimals,
          ),
          0,
        ),
      );

      this.logger.log(
        `Spending ${solAmount} SOL for ${tokenAmountWithSlippage} tokens, originally ${tokenAmount} (${slippagePercent}% slippage)`,
      );

      const tokenAccoount = getAssociatedTokenAddressSync(
        mint,
        buyer.publicKey,
        true,
      );

      const transaction = new VersionedTransaction(
        new TransactionMessage({
          payerKey: buyer.publicKey,
          recentBlockhash: blockHash.blockhash,
          instructions: [
            ComputeBudgetProgram.setComputeUnitLimit({
              units: 62_000,
            }),
            ComputeBudgetProgram.setComputeUnitPrice({
              microLamports: 1_200_000,
            }),
            createAssociatedTokenAccountInstruction(
              buyer.publicKey,
              tokenAccoount,
              buyer.publicKey,
              mint,
            ),
            await PumpFun.buyTokenInstruction(
              provider,
              buyer,
              mint,
              bondingCurve,
              tokenAmountWithSlippage,
              solAmount,
            ),
          ],
        }).compileToV0Message(),
      );

      transaction.sign([buyer]);
      transactions.push(transaction);
    }

    const txHashes: string[] = [];

    await Promise.allSettled(
      transactions.map(
        (transaction) =>
          new Promise(async (resolve) => {
            try {
              const txHash = await connection.sendTransaction(transaction, {
                skipPreflight: true,
              });

              this.logger.log(`Buy tx hash: ${txHash}`);

              txHashes.push(txHash);
            } catch (error) {
              this.logger.error(error);
            }

            resolve(true);
          }),
      ),
    );

    return txHashes;
  }

  async waitForToken(
    connection: Connection,
    commitment: Commitment,
    mint: PublicKey,
  ) {
    return new Promise((resolve) => {
      const intervalId = setInterval(async () => {
        const mintAccountInfo = await connection.getAccountInfo(
          mint,
          commitment,
        );

        if (mintAccountInfo && mintAccountInfo?.data) {
          const data = MintLayout.decode(mintAccountInfo?.data);

          if (data?.isInitialized) {
            clearInterval(intervalId);
            resolve(true);
          }
        }
      }, 50);
    });
  }

  async waitForBlockSlot(
    connection: Connection,
    commitment: Commitment,
    blockSlot: number,
  ) {
    return await new Promise<
      RpcResponseAndContext<BlockhashWithExpiryBlockHeight>
    >((resolve) => {
      const intervalId = setInterval(async () => {
        const blockHash =
          await connection.getLatestBlockhashAndContext(commitment);

        if (blockHash.context.slot >= blockSlot) {
          clearInterval(intervalId);
          resolve(blockHash);
        }
      }, 100);
    });
  }

  async create(
    creator: Keypair,
    dto: CreatePumpFunTokenDto,
    file: Express.Multer.File,
    buyers: { address: string; solAmount: number }[],
  ) {
    const { name, symbol } = dto;

    const commitment: Commitment = "confirmed";
    const connection = new Connection(this.config.rpcUrl, commitment);
    const provider = new AnchorProvider(connection, new Wallet(creator), {
      commitment,
      skipPreflight: true,
    });

    const accounts = await this.accountsService.findAll({
      withSecretKeys: true,
    });

    const buyerAccounts: { buyer: Keypair; solAmount: number }[] = [];
    const accountIdToAccount = new Map<string, (typeof accounts)[0]>(
      accounts.map((account) => [account.publicKey, account]),
    );

    for (const { address, solAmount } of buyers) {
      try {
        const account = accountIdToAccount.get(address);

        if (!account) {
          throw new BadRequestException(`Account with id ${address} not found`);
        }

        if (account.balance < solAmount) {
          throw new BadRequestException(
            `Insufficient balance for account ${address}. Only ${account.balance} SOL available but ${solAmount} required`,
          );
        }

        const buyer = Keypair.fromSecretKey(bs58.decode(account.secretKey));

        buyerAccounts.push({
          buyer,
          solAmount,
        });
      } catch (error) {
        this.logger.error(error);
      }
    }

    const mint = Keypair.generate();
    const bondingCurve = PumpFun.getMintBondingCurve(mint.publicKey);
    const metadataUri = await PumpFun.putTokenMetadata(dto, file);

    const mintBlockHash =
      await connection.getLatestBlockhashAndContext(commitment);

    const transaction = new VersionedTransaction(
      new TransactionMessage({
        payerKey: creator.publicKey,
        recentBlockhash: mintBlockHash.value.blockhash,
        instructions: [
          ComputeBudgetProgram.setComputeUnitLimit({
            units: 250_000,
          }),
          ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: 1_900_000,
          }),
          await PumpFun.createTokenInstruction(
            provider,
            creator,
            mint,
            bondingCurve,
            name,
            symbol,
            metadataUri,
          ),
        ],
      }).compileToV0Message(),
    );

    transaction.sign([creator, mint]);

    const mintTxHash = await connection.sendTransaction(transaction, {
      skipPreflight: true,
    });

    this.logger.log(
      `[${mintBlockHash.context.slot}] Mint tx hash: ${mintTxHash}`,
    );

    const verifiedBlockHash = await this.waitForBlockSlot(
      connection,
      commitment,
      mintBlockHash.context.slot + 5,
    );

    this.logger.log(`[${verifiedBlockHash.context.slot}] Mint is verified`);

    const txHashes: string[] = [mintTxHash];

    const buyTxHashes = await this._buyTokenFromAccounts(
      connection,
      commitment,
      provider,
      verifiedBlockHash.value,
      mint.publicKey,
      bondingCurve,
      buyerAccounts,
    );

    txHashes.push(...buyTxHashes);

    return {
      mint,
      bondingCurve,
      associatedBondingCurve: getAssociatedTokenAddressSync(
        mint.publicKey,
        bondingCurve,
        true,
      ),
      txHashes,
    };
  }

  /**
   * Buy tokens for input solana amount
   * @param wallet
   * @param solAmount
   * @param slipPagePercentage
   * @returns
   */
  async buy(
    wallet: Keypair,
    solAmount: number,
    slipPagePercentage?: number,
    priorityMicroLamptorsFee?: number,
  ) {
    const token = await this.getToken();
    const account = await this.accountsService.findOne(
      wallet.publicKey.toBase58(),
    );

    if (account!.balance < solAmount) {
      throw new BadRequestException("Insufficient balance");
    }

    let createAssociatedTokenAccount = false;

    const tokenAccount = await Solana.getWalletTokenAccount(
      wallet.publicKey,
      new PublicKey(token.tokenId),
    );

    const isTokenAccountInitialized =
      await this.accountsService.isTokenAccountInitialized(
        tokenAccount!.toBase58(),
      );

    // Save data to the database
    if (!isTokenAccountInitialized) {
      if (!tokenAccount){
        throw Error("Account not found");
      }
      const info = await this.connection!.getAccountInfo(tokenAccount);

      if (!info) {
        createAssociatedTokenAccount = true;
      } else {
        await this.accountsService.update(wallet.publicKey.toBase58(), {
          tokenAccountId: tokenAccount.toBase58(),
          isTokenAccountInitialized: true,
        });
      }
    }

    return token.buy(
      wallet,
      solAmount,
      slipPagePercentage,
      createAssociatedTokenAccount,
      priorityMicroLamptorsFee,
    );
  }

  async getSPLBalancePercentageFromDb(
    wallet: Keypair,
    percent: number,
  ): Promise<number> {
    const percentDecimals = percent / 100;
    const account = await this.accountsService.findOne(
      wallet.publicKey.toBase58(),
    );

    if (!account) throw new Error("Account not found");

    return account.tokenBalance * percentDecimals;
  }

  async sell(
    wallet: Keypair,
    tokenAmount: number,
    slipPagePercentage?: number,
    skipLimit?: boolean,
    priorityMicroLamptorsFee?: number,
  ) {
    const config = await this.appService.getConfig();
    const token = await this.getToken();

    let sellTokenAmount = tokenAmount;

    this.logger.debug(
      `Selling ${tokenAmount} of tokens for wallet [${wallet.publicKey.toBase58()}]`,
    );

    if (!skipLimit) {
      // For example we available to sell only half (50%) of the tokens
      // const maxTokensToSell = await token.getSPLBalancePercentage(
      //   wallet,
      //   config.balanceUsagePercent,
      // );
      const maxTokensToSell = await this.getSPLBalancePercentageFromDb(
        wallet,
        config!.balanceUsagePercent,
      );

      this.logger.debug(
        `Max tokens to sell for wallet [${wallet.publicKey.toBase58()}]: ${maxTokensToSell}`,
      );

      sellTokenAmount = Math.min(sellTokenAmount, maxTokensToSell);

      const sellFromMaxPercentage = (sellTokenAmount * 100) / maxTokensToSell;

      if (sellTokenAmount !== tokenAmount) {
        this.logger.debug(
          `[REWRITE] Selling ${sellTokenAmount} (${sellFromMaxPercentage}% from max) of tokens`,
        );
      }
    } else {
      this.logger.debug("Skipping limit of max tokens to sell");
    }

    const precalculatedMinSolOutput = await this.calculateMinSolOutput(
      sellTokenAmount,
      slipPagePercentage,
    );

    return token.sell(
      wallet,
      sellTokenAmount,
      slipPagePercentage,
      priorityMicroLamptorsFee,
      precalculatedMinSolOutput,
    );
  }

  async transferAllFromManyToOne(
    feePayer: Keypair,
    holders: Keypair[],
    addressId: string,
    priorityMicroLamptorsFee?: number,
  ) {
    const token = await this.getToken();

    const txHash = await token.transferAllFromManyToOne(
      feePayer,
      holders,
      addressId,
      priorityMicroLamptorsFee,
    );

    return txHash;
  }

  async transfer(
    wallet: Keypair,
    addressId: string,
    amountPercent: number,
    priorityMicroLamptorsFee?: number,
  ) {
    const token = await this.getToken();

    const txHash = await token.transfer(
      wallet,
      addressId,
      amountPercent,
      priorityMicroLamptorsFee,
    );

    return txHash;
  }
}
