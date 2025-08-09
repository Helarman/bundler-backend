import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DcaTxType } from "@prisma/client";
import { EncryptionService } from "../../encryption/encryption.service";
import { PrismaService } from "../../../prisma.service";
import * as bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import { SolanaTokenService } from "../../solana-token/solana-token.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SolanaTxCreatedEvent } from "../../solana/events/solana.events";
import { SolanaTransactionsService } from "../../solana/services/solana-transactions.service";

interface GetAccountsResponseItem {
  minDelayBetweenTxsInSeconds: number;
  maxDelayBetweenTxsInSeconds: number;
  reserveSolAmount: number;
  reserveTokenAmount: number;
  balanceUsagePercent: number;
  isActive: boolean;
  account: {
    publicKey: string;
    balance: number;
    tokenBalance: number;
    secretKey: string;
  };
  allowNextAt: Date | null;
  lastTxType: DcaTxType | null;
}

/**
 * @deprecated
 */
@Injectable()
export class SolanaDcaJob {
  private readonly logger = new Logger(SolanaDcaJob.name);
  private processingPoolIds = new Set<string>();

  constructor(
    private readonly txService: SolanaTransactionsService,
    private readonly eventEmitter: EventEmitter2,
    private readonly prismaService: PrismaService,
    private readonly encryptService: EncryptionService,
    private solanaTokenService: SolanaTokenService,
  ) {}

  private async getAccounts(): Promise<GetAccountsResponseItem[]> {
    const ongoingSignerIds = await this.txService.getOngoingSignerIds();

    return await this.prismaService.dcaSolanaAccount.findMany({
      where: {
        isActive: true,
        account: {
          publicKey: {
            notIn: ongoingSignerIds,
          },
          isBalanceSynced: true,
          isTokenBalanceSynced: true,
        },
      },
      include: {
        account: {
          select: {
            publicKey: true,
            balance: true,
            tokenBalance: true,
            secretKey: true,
          },
        },
      },
    });
  }

  async processAccount(dcaAccount: GetAccountsResponseItem) {
    const {
      account,
      minDelayBetweenTxsInSeconds,
      maxDelayBetweenTxsInSeconds,
      reserveSolAmount,
      reserveTokenAmount,
      balanceUsagePercent,
    } = dcaAccount;

    if (this.processingPoolIds.has(account.publicKey)) return;

    this.processingPoolIds.add(account.publicKey);

    const transaction = await this.txService.getLastForSigner(
      account.publicKey,
    );

    let nextTxType: DcaTxType = DcaTxType.BUY;

    const remove = () => this.processingPoolIds.delete(account.publicKey);

    if (transaction) {
      if (!transaction.isConfirmed && !transaction.isFailed) {
        remove();
        return;
      } 
      if (new Date(dcaAccount.allowNextAt!).getTime() > Date.now()) {
        remove();
        return;
      } // Is not time to execute

      if (transaction.isConfirmed) {
        nextTxType =
          dcaAccount.lastTxType === DcaTxType.BUY
            ? DcaTxType.SELL
            : DcaTxType.BUY;
      } else {
        nextTxType = dcaAccount.lastTxType!;
      }
    }

    // Check if account have enough SOL to execute transaction
    if (account.balance < reserveSolAmount && nextTxType === DcaTxType.BUY) {
      this.logger.debug(
        `${account.publicKey} have only ${account.balance} SOL, reserve is ${reserveSolAmount} so we change tx type to SELL`,
      );

      nextTxType = DcaTxType.SELL;
    }

    if (account.tokenBalance < 100 && nextTxType === DcaTxType.SELL) {
      this.logger.debug(`No tokens to sell. Skipping`);
      remove();
      return;
    }

    const delayInSeconds = Math.floor(
      Math.random() *
        (maxDelayBetweenTxsInSeconds - minDelayBetweenTxsInSeconds) +
        minDelayBetweenTxsInSeconds,
    );

    const allowNextAt = new Date(Date.now() + delayInSeconds * 1000);

    this.logger.debug(
      `${account.publicKey} do ${nextTxType} with delay ${delayInSeconds} seconds so allow next at ${allowNextAt.toISOString()}`,
    );

    try {
      const owner = Keypair.fromSecretKey(
        bs58.decode(this.encryptService.decrypt(account.secretKey)),
      );

      let solAmount = 0;
      let tokenAmount = 0;
      let txHash = "";

      if (nextTxType === DcaTxType.BUY) {
        solAmount = account.balance - reserveSolAmount;

        txHash = await this.solanaTokenService.buy(owner, solAmount);
      }

      if (nextTxType === DcaTxType.SELL) {
        const availableTokenBalance = account.tokenBalance - reserveTokenAmount;

        tokenAmount = Math.floor(
          (availableTokenBalance * balanceUsagePercent) / 100,
        );
        txHash = await this.solanaTokenService.sell(owner, tokenAmount);
      }

      this.logger.verbose(
        `Sended ${nextTxType} tx ${txHash} with ${solAmount} SOL and ${tokenAmount} tokens`,
      );

      await this.prismaService.dcaSolanaAccount.update({
        where: { accountId: account.publicKey },
        data: {
          lastTxType: nextTxType,
          allowNextAt,
        },
      });

      this.eventEmitter.emit(
        SolanaTxCreatedEvent.id,
        new SolanaTxCreatedEvent({
          txHash,
          signerIds: [account.publicKey],
        }),
      );
    } catch (error) {
      this.logger.error(error);
    }

    remove();
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async loop() {
    const accounts = await this.getAccounts();

    // Promise.allSettled(accounts);

    // Promise.allSettled(
    //   accounts.map((account) =>
    //     this.processAccount(account as GetAccountsResponseItem),
    //   ),
    // );

    for (const account of accounts) {
      await this.processAccount(account);
    }
  }
}
