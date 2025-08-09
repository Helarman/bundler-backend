import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Keypair } from "@solana/web3.js";
import { EncryptionService } from "../../encryption/encryption.service";
import { SolanaDcaService } from "../services/solana-dca.service";
import { SolanaTxCreatedEvent } from "../../solana/events/solana.events";
import { SolanaService } from "../../solana/services/solana.service";
import * as bs58 from "bs58";
import { DcaAccountEntity } from "../entities/dca-order-account.entity";
import { AccountEntity } from "../../accounts/entities/account.entity";
import { SolanaTokenService } from "../../solana-token/solana-token.service";
import { AppService } from "../../../app.service";
import { sleep } from "../../@core/utils/sleep";
import { SolanaTransactionsService } from "../../solana/services/solana-transactions.service";
import { DcaTxType } from "@prisma/client";
import { randomInt } from "../../@core/utils/random";

type ExtendedDcaAccount = DcaAccountEntity & {
  account: AccountEntity;
  secretKey: Uint8Array;
};
@Injectable()
export class SolanaDcaJob {
  private readonly logger = new Logger(SolanaDcaJob.name);

  /**
   * Set of account ids that are processing
   */
  private processingAccountIds = new Set<string>();

  constructor(
    private readonly txService: SolanaTransactionsService,
    private readonly appService: AppService,
    private readonly eventEmitter: EventEmitter2,
    private service: SolanaDcaService,
    private readonly solanaService: SolanaService,
    private solanaTokenService: SolanaTokenService,
    private readonly encryptService: EncryptionService,
  ) {}

  async onModuleInit() {}

  private async _getAccounts(): Promise<ExtendedDcaAccount[]> {
    const accounts = await this.service.getLoopAccounts();

    return accounts.map((dcaAccount) => ({
      ...dcaAccount,
      secretKey: bs58.decode(
        this.encryptService.decrypt(dcaAccount.account.secretKey),
      ),
    }));
  }

  /**
   * Checks if the account is valid for buy
   * @param dcaAccount
   * @returns
   */
  private async _isValidForBuy(
    dcaAccount: ExtendedDcaAccount,
  ): Promise<boolean> {
    const minSolAmountToSpend = 0.001;

    const {
      account,
      reserveTokenAmount,
      reserveSolAmount,
      minTokenPrice,
      maxTokenPrice,
      canBuy,
      maxTokenAmount,
      bumpOperateSolAmount,
    } = dcaAccount;

    if (!canBuy) return false;

    const tokenBalanceMaxLimit = maxTokenAmount + reserveTokenAmount;

    const { solana_price_per_token } = this?.solanaTokenService?.tokenData ?? {
      solana_price_per_token: 0,
    };

    const solanaBalance = account.balance - reserveSolAmount;

    if (
      bumpOperateSolAmount &&
      bumpOperateSolAmount > 0 &&
      solanaBalance < bumpOperateSolAmount &&
      bumpOperateSolAmount !== 999
    ) {
      this.logger.error(
        `Account ${account.publicKey} has not enough SOL for bump operation`,
      );
      return false;
    }

    if (solanaBalance < minSolAmountToSpend) {
      this.logger.error(
        `Account ${account.publicKey} has not enough SOL to buy tokens`,
      );
      return false;
    }

    if (account.tokenBalance >= tokenBalanceMaxLimit && maxTokenAmount !== 0) {
      this.logger.error(
        `Account ${account.publicKey} will overbuy token limit`,
      );
      return false;
    }

    if (solana_price_per_token > maxTokenPrice) {
      this.logger.error(
        `Account ${account.publicKey} can't buy because price is too high`,
      );
      return false;
    }

    if (solana_price_per_token <= minTokenPrice) {
      this.logger.error(
        `Account ${account.publicKey} can't buy because price is too low`,
      );
      return false;
    }

    return true;
  }

  /**
   * Checks if the account is valid for sell
   * @param dcaAccount
   * @returns
   */
  private async _isValidForSell(
    dcaAccount: ExtendedDcaAccount,
  ): Promise<boolean> {
    const { account, reserveTokenAmount, canSell, minTokenAmountPerSale } =
      dcaAccount;

    if (!canSell) return false;

    const tokenBalance = account.tokenBalance - reserveTokenAmount;

    if (tokenBalance < minTokenAmountPerSale) return false;

    return true;
  }

  /**
   * Checks if the account can continue
   * @param dcaAccount
   * @returns
   */
  private async _canContinue(dcaAccount: ExtendedDcaAccount): Promise<boolean> {
    const { isActive, allowNextAt } = dcaAccount;

    if (!isActive) return false;

    const lastTx = await this.txService.getLastForSigner(dcaAccount.accountId);

    if (lastTx) {
      const { isConfirmed, isFailed } = lastTx;
      if (!isConfirmed && !isFailed) {
        this.logger.debug(
          `Last tx is not confirmed or failed for ${dcaAccount.accountId}`,
        );
        return false;
      }

      if (new Date(allowNextAt).getTime() > Date.now()) {
        this.logger.debug(
          `Last tx is not allowed to execute for ${dcaAccount.accountId} because it is not time to execute yet`,
        );
        return false;
      }
    }

    return true;
  }

  /**
   * Gets the type of the next transaction
   * @param dcaAccount
   * @returns
   */
  private async _getTypeForNextTransaction(
    dcaAccount: ExtendedDcaAccount,
  ): Promise<DcaTxType | null> {
    let type: DcaTxType | null = null;

    const isRandom = true;
    const lastTransactionType = dcaAccount?.lastTxType;
    const isBuyValid = await this._isValidForBuy(dcaAccount);
    const isSellValid = await this._isValidForSell(dcaAccount);

    if (
      !type &&
      dcaAccount.bumpOperateSolAmount > 0 &&
      !isBuyValid &&
      isSellValid
    ) {
      type = DcaTxType.FULL_SELL;
    }

    if (!type && isRandom && isBuyValid && isSellValid) {
      // one or two
      const randomValue = randomInt(1, 2);

      if (randomValue === 1) {
        type = DcaTxType.BUY;
      } else {
        type = DcaTxType.SELL;
      }

      this.logger.debug(`Random number ${randomValue} so type is ${type}`);
    }

    // If last is BUY and SELL is valid - SELL
    if (!type && lastTransactionType === DcaTxType.BUY && isSellValid) {
      type = DcaTxType.SELL;
    }

    // If last is SELL and BUY is valid - BUY
    if (!type && lastTransactionType === DcaTxType.SELL && isBuyValid) {
      type = DcaTxType.BUY;
    }

    // If not defined and BUY is valid - BUY
    if (!type && isBuyValid) {
      type = DcaTxType.BUY;
    }

    // If not defined and SELL is valid - SELL
    if (!type && isSellValid) {
      type = DcaTxType.SELL;
    }

    return type;
  }

  /**
   * Gets the delay in seconds for the next transaction
   * @param dcaAccount
   * @returns
   */
  private _getDelayInSeconds(dcaAccount: ExtendedDcaAccount): number {
    const { minDelayBetweenTxsInSeconds, maxDelayBetweenTxsInSeconds } =
      dcaAccount;

    return Math.floor(
      Math.random() *
        (maxDelayBetweenTxsInSeconds - minDelayBetweenTxsInSeconds) +
        minDelayBetweenTxsInSeconds,
    );
  }

  private async _calculateBuyTokenSolAmount(
    dcaAccount: ExtendedDcaAccount,
  ): Promise<number> {
    const {
      account: { tokenBalance, balance },
      maxTokenAmount,
      reserveTokenAmount,
      reserveSolAmount,
      bumpOperateSolAmount,
    } = dcaAccount;

    const availableSolBalance = balance - reserveSolAmount;
    const availableTokenBalance = tokenBalance - reserveTokenAmount;
    const maxAvailableToBuy = maxTokenAmount - availableTokenBalance;

    let solAmount =
      await this.solanaTokenService.tokenToSolAmount(maxAvailableToBuy);

    if (bumpOperateSolAmount && bumpOperateSolAmount > 0) {
      solAmount = bumpOperateSolAmount;
    }

    // Get the available SOL balance from provided values
    return Math.min(solAmount, availableSolBalance);
  }

  /**
   * Processes single account asynchronously
   * @param dcaAccount
   * @returns
   */
  private async _processAccount(dcaAccount: ExtendedDcaAccount) {
    // const OPERATIONS_PER_SECOND = 3;

    const config = await this.appService.getConfig();

    if (this.processingAccountIds.has(dcaAccount.accountId)) return;

    this.processingAccountIds.add(dcaAccount.accountId);

    await new Promise(async (resolve) => {
      try {
        // Check if the account can continue
        const canContinue = await this._canContinue(dcaAccount);

        if (!canContinue) {
          resolve(true);
          return;
        }

        const type = await this._getTypeForNextTransaction(dcaAccount);

        // If type is null - we can't continue
        if (!type) {
          resolve(true);
          return;
        }

        let solAmount = 0;
        let tokenAmount = 0;
        let txHash = "";

        const {
          account: { publicKey, tokenBalance },
          secretKey,
          reserveTokenAmount,
          balanceUsagePercent,
          slippagePercent,
          bumpOperateSolAmount,
        } = dcaAccount;

        const owner = Keypair.fromSecretKey(secretKey);
        const delayInSeconds = this._getDelayInSeconds(dcaAccount);
        const allowNextAt = new Date(Date.now() + delayInSeconds * 1000);

        if (type === DcaTxType.BUY && config) {
          solAmount = await this._calculateBuyTokenSolAmount(dcaAccount);

          txHash = await this.solanaTokenService.buy(
            owner,
            solAmount,
            slippagePercent,
            config.priorityMicroLamptorsFee,
          );
        }

        if (type === DcaTxType.SELL || type === DcaTxType.FULL_SELL ) {
          // tokenAmount
          const availableTokenBalance = tokenBalance - reserveTokenAmount;
          if(!config){
            throw Error;
          }
          
          if (type === DcaTxType.FULL_SELL) {
            tokenAmount = tokenBalance;
          } else if (
            bumpOperateSolAmount &&
            bumpOperateSolAmount > 0 &&
            type == DcaTxType.SELL
          ) {
            tokenAmount = await this.solanaTokenService.solToTokenAmount(
              (bumpOperateSolAmount * balanceUsagePercent) / 100,
            );
          } else {
            tokenAmount = Math.floor(
              (availableTokenBalance * balanceUsagePercent) / 100,
            );
          }

          txHash = await this.solanaTokenService.sell(
            owner,
            tokenAmount,
            slippagePercent,
            true,
            config.priorityMicroLamptorsFee,
          );
        }

        this.logger.verbose(
          `Sended ${type} tx ${txHash} with ${solAmount} SOL and ${tokenAmount} tokens`,
        );

        await this.service.updateAccount(dcaAccount.accountId, {
          lastTxType: type,
          allowNextAt,
        });

        if (type === DcaTxType.BUY) {
          await this.service.saveBuyDate(publicKey);
        }

        if (type === DcaTxType.SELL) {
          await this.service.saveSellDate(publicKey);
        }

        this.eventEmitter.emit(
          SolanaTxCreatedEvent.id,
          new SolanaTxCreatedEvent({
            txHash,
            signerIds: [publicKey],
          }),
        );

        // await sleep(1000 / OPERATIONS_PER_SECOND);
      } catch (error) {
        this.logger.error(error);
      }

      resolve(true);
    });

    this.processingAccountIds.delete(dcaAccount.accountId);
  }

  /**
   * Loop for handling DCA accounts
   */
  @Cron(CronExpression.EVERY_5_SECONDS)
  async loop() {
    // if (this.appService.isPanicSale()) {
    //   this.logger.debug("Panic sale is active, skipping");
    //   return;
    // }

    const accounts = await this._getAccounts();

    if (accounts.length === 0) return;

    this.logger.debug(`Processing ${accounts.length} accounts`);

    // Promise.allSettled(
    //   accounts.map((account) => this._processAccount(account)),
    // );
    for (const account of accounts) {
      await this._processAccount(account);
      await sleep(50);
    }
  }
}
