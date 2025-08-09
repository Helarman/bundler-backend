import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Cron, CronExpression } from "@nestjs/schedule";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  AccountLayout,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  AccountInfo,
  Commitment,
  LAMPORTS_PER_SOL,
  PublicKey,
  SignatureStatus,
} from "@solana/web3.js";
import { AccountCreatedEvent } from "../../accounts/events/accounts.events";
import { AccountsService } from "../../accounts/services/accounts.service";
import { AppService } from "../../../app.service";
import { PrismaService } from "../../../prisma.service";
import { SolanaDcaService } from "../../solana-dca/services/solana-dca.service";
import { SolanaTokenService } from "../../solana-token/solana-token.service";
import {
  SolanaSynchronizeAccountsEvent,
  SolanaTxCreatedEvent,
  SolanaTxFailedEvent,
  SolanaTxSuccessEvent,
} from "../events/solana.events";
import { SolanaProviderService } from "../services/solana-provider.service";
import { SolanaTransactionsService } from "../services/solana-transactions.service";
import { SolanaService } from "../services/solana.service";

@Injectable()
export class SolanaBlockhainSynchronizerJob {
  private logger = new Logger(SolanaBlockhainSynchronizerJob.name);

  /**
   *  Commitment level that will be used to listen for changes
   */
  public readonly commitment: Commitment = "finalized";

  constructor(
    private readonly dcaService: SolanaDcaService,
    private readonly appService: AppService,
    private txService: SolanaTransactionsService,
    private readonly prismaService: PrismaService,
    private readonly solanaService: SolanaService,
    private readonly providerService: SolanaProviderService,
    private readonly accountsService: AccountsService,
    private readonly tokenService: SolanaTokenService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onApplicationBootstrap() {
    await this.prismaService.account.updateMany({
      data: {
        isBalanceSynced: false,
        isTokenBalanceSynced: false,
      },
    });

    this.synchonizeAccounts({ type: "all" });
  }

  @OnEvent(SolanaSynchronizeAccountsEvent.id)
  async synchonizeAccounts(event: SolanaSynchronizeAccountsEvent) {
    const { type = "unsynced" } = event;

    const accounts = await this.accountsService.findAll();
    const requiredSyncAccounts = accounts.filter((a) => {
      if (type === "all") return true;

      return !a.isBalanceSynced || !a.isTokenBalanceSynced;
    });

    await this.syncByRpcRequest({
      accountIds: requiredSyncAccounts.map((a) => a.publicKey),
    });
  }

  /**
   * Handler for account change event
   * @param accountId Id of the account that was changed
   * @param accountInfo Account info that was changed
   * @returns void
   */
  private async _onAccountChange({
    accountId,
    info,
  }: {
    accountId: string;
    info: AccountInfo<Buffer> | null;
  }) {
    await this.accountsService.update(accountId, {
      ...(info?.lamports
        ? {
            balance: info.lamports / LAMPORTS_PER_SOL,
          }
        : {}),
      isBalanceSynced: true,
      syncedAt: new Date(),
    });
  }

  private async _onTokenAccountChange({
    accountId,
    tokenAccountId,
    info,
  }: {
    accountId?: string;
    tokenAccountId?: string;
    info: AccountInfo<Buffer> | null;
  }) {
    const isTokenAccountInitialized = info?.data && info?.data?.length > 0;

    if (!accountId && !tokenAccountId) {
      throw new Error("Account id or token account id is required");
    }

    if (!isTokenAccountInitialized) {
      return;
    }

    if (!info) {
      if (tokenAccountId) {
        await this.accountsService.updateByTokenAccount(tokenAccountId, {
          isTokenBalanceSynced: true,
        });

        return;
      }

      if (accountId) {
        await this.accountsService.update(accountId, {
          isBalanceSynced: true,
        });

        return;
      }

      return;
    }

    const token = await this.tokenService.getToken();
    const decimals = await token.getDecimals();
    const data = AccountLayout.decode(info.data);

    if (!accountId) {
      accountId = data.owner.toBase58();
    }

    const tokenBalance = Number(data.amount) / 10 ** decimals;

    await this.accountsService.update(accountId, {
      tokenBalance,
      isTokenAccountInitialized: true,
      isTokenBalanceSynced: true,
      syncedAt: new Date(),
    });
  }

  /**
   * Handler for signature event
   * @param txHash Id of the transaction
   * @param result Result of the transaction
   * @param context Context of the transaction
   * @param signerId Id of the account that was signer of the transaction
   */
  private async _onTxSignature({
    txHash,
    status,
    signerIds,
    timeoutLimit = 30_000,
  }: {
    txHash: string;
    status: SignatureStatus;
    signerIds?: string[];
    timeoutLimit?: number;
  }) {
    const ongoingTx = await this.txService.get(txHash);

    if (ongoingTx && signerIds) {
      signerIds.push(...ongoingTx.signerIds);

      // Remove duplicates
      signerIds = [...new Set(signerIds)];
    }

    // If we have some error
    if (
      status?.err ||
      (ongoingTx &&
        new Date(ongoingTx.createdAt).getTime() + timeoutLimit <
          new Date().getTime())
    ) {
      this.logger.error(`Transaction ${txHash} failed`, status?.err);

      this.eventEmitter.emit(
        SolanaTxFailedEvent.id,
        new SolanaTxFailedEvent({
          txHash,
          signerIds,
        }),
      );

      await this.txService.failTx(txHash);

      return;
    }

    if (
      status?.confirmationStatus &&
      (status.confirmationStatus === "finalized" ||
        (status.confirmationStatus === "processed" &&
          this.commitment === "processed") ||
        (status.confirmationStatus === "confirmed" &&
          this.commitment === "processed") ||
        (status.confirmationStatus === "confirmed" &&
          this.commitment === "confirmed"))
    ) {
      // Finalized!
      this.logger.debug(`Transaction ${txHash} is finalized!`);

      this.eventEmitter.emit(
        SolanaTxSuccessEvent.id,
        new SolanaTxSuccessEvent({
          txHash,
          signerIds,
        }),
      );

      await this.txService.confirmTx(txHash);

      return;
    }

    await this.txService.update(txHash, {
      lastScannedAt: new Date(),
    });
  }

  private _getTokenAddress(tokenId: string, publicKey: string) {
    return getAssociatedTokenAddressSync(
      new PublicKey(tokenId),
      new PublicKey(publicKey),
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    ).toBase58();
  }

  private async _assignTokenAccountIds() {
    const accounts = await this.prismaService.account.findMany({
      where: {
        tokenAccountId: null,
      },
      select: {
        id: true,
        publicKey: true,
      },
    });

    if (accounts.length === 0) return;

    const config = await this.appService.getConfig();

    for (const account of accounts) {
      await this.accountsService.update(account.id, {
        tokenAccountId: this._getTokenAddress(
          config!.tokenId,
          account.publicKey,
        ),
      });
    }
  }

  async syncByRpcRequest({ accountIds }: { accountIds?: string[] }) {
    await this._assignTokenAccountIds();

    const accounts = await this.prismaService.account.findMany({
      where: {
        OR: [
          { id: { in: accountIds } },
          { publicKey: { in: accountIds } },
          { tokenAccountId: { in: accountIds } },
        ],
        isRemoved: false,
        isActive: true,
      },
      select: {
        publicKey: true,
        tokenAccountId: true,
        isBalanceSynced: true,
        isTokenBalanceSynced: true,
        isTokenAccountInitialized: true,
      },
    });
    // this.logger.log(`Syncing ${accounts.length} accounts by RPC request`);

    if (accounts.length === 0) return;

    const tokenAccountIdToAccount = new Map(
      accounts.map((account) => [account.tokenAccountId, account]),
    );

    const accountIdsForInfo = accounts
      .map((a) => [
        a.publicKey,
        ...(a.tokenAccountId ? [a.tokenAccountId] : []),
      ])
      .flat();

    const accountsInfo = await this.solanaService.getAccountsInfo({
      accountIds: accountIdsForInfo,
      connection: this.providerService.connection!,
    });

    await Promise.all(
      accountsInfo.map(
        ({ accountId, info }) =>
          new Promise(async (resolve) => {
            try {
              const isTokenAccount = tokenAccountIdToAccount.has(accountId);

              if (isTokenAccount) {
                const account = tokenAccountIdToAccount.get(accountId);

                await this._onTokenAccountChange({
                  ...(account ? { accountId: account.publicKey } : {}),
                  tokenAccountId: accountId,
                  info,
                });
              } else {
                await this._onAccountChange({
                  accountId,
                  info,
                });
              }
            } catch (error) {
              this.logger.error(error);
            }

            resolve(null);
          }),
      ),
    );
  }

  /**
   * Handler for tx created event
   * @param event
   */
  @OnEvent(SolanaTxCreatedEvent.id)
  private async onNewTxCreated(event: SolanaTxCreatedEvent) {
    const { txHash, signerIds } = event?.params || {};

    this.logger.debug(`Transaction created ${txHash}`);

    // Until transaction is completed, we need to mark account as not synced
    if (signerIds) {
      await this.prismaService.account.updateMany({
        where: {
          publicKey: {
            in: signerIds,
          },
        },
        data: {
          isBalanceSynced: false,
          isTokenBalanceSynced: false,
        },
      });
    }

    await this.txService.create({
      txHash,
      signerIds,
    });
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  private async _lazyAccountSync() {
    // Exclude synchronizing accounts that have processing transactions
    const ongoingTransactions = await this.txService.getOngoing();
    const txProcessingSignerIds = ongoingTransactions.reduce((acc, tx) => {
      acc.push(...tx.signerIds);
      return acc;
    }, [] as string[]);

    // const dcaActiveAccounts =
    //   await this.prismaService.dcaSolanaAccount.findMany({
    //     where: {
    //       isActive: true,
    //     },
    //     select: {
    //       accountId: true,
    //     },
    //   });

    // if (dcaActiveAccounts.length === 0) return;

    // const dcaAccountIdsSet = new Set(
    //   dcaActiveAccounts.map((account) => account.accountId),
    // );

    // for (const signerId of txProcessingSignerIds) {
    //   if (dcaAccountIdsSet.has(signerId)) {
    //     dcaAccountIdsSet.delete(signerId);
    //   }
    // }

    // if (dcaAccountIdsSet.size === 0) return;

    const accounts = await this.prismaService.account.findMany({
      where: {
        publicKey: {
          // in: Array.from(dcaAccountIdsSet),
          notIn: txProcessingSignerIds,
        },
      },
    });

    if (accounts.length === 0) return;

    // this.logger.log(
    //   `Starting planned synchronization of ${accounts.length} accounts`,
    // );

    await this.syncByRpcRequest({
      accountIds: accounts.map((a) => a.publicKey),
    });
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  private async _lazyTxsSync() {
    const ongoingTxs = await this.txService.getOngoing();

    if (ongoingTxs.length === 0) return;

    const txStatuses = await this.solanaService.getTxsStatuses({
      txHashes: ongoingTxs.map((tx) => tx.txHash),
      connection: this.providerService.connection!,
    });

    await Promise.all(
      ongoingTxs.map(
        ({ txHash, signerIds }) =>
          new Promise(async (resolve) => {
            try {
              const status = txStatuses.find(
                (s) => s.txHash === txHash,
              )?.status;
              if (!status) {
                throw Error
              }
              await this._onTxSignature({
                txHash,
                status,
                signerIds,
              });
            } catch (error) {
              this.logger.error(error);
            }

            resolve(null);
          }),
      ),
    );
  }

  /**
   * When new account is created, we need to setup listener for it
   * So we can track the changes of it's balance and etc
   * @param event
   */
  @OnEvent(AccountCreatedEvent.id)
  private async onNewAccountCreated() {
    await this.synchonizeAccounts({
      type: "unsynced",
    });
  }
}
