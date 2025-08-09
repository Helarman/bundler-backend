import { Controller } from "../@core/decorators/controller.decorator";
import { Serializable } from "../@core/decorators/serializable.decorator";
import {
  BadRequestException,
  Body,
  Delete,
  Get,
  Logger,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ApiConsumes, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { Keypair, PublicKey, SendTransactionError } from "@solana/web3.js";
import { AccountsService } from "../accounts/services/accounts.service";
import { TransferAllDto } from "./dtos/transfer-all.dto";
import { TransactionsResponseEntity } from "./entities/transfer-all-response.entity";
import { SolanaTokenService } from "./solana-token.service";
import * as bs58 from "bs58";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SolanaTxCreatedEvent } from "../solana/events/solana.events";
import { SolanaTokenDataEntity } from "./entities/solana-token.entity";
import { SellAllSPLDto } from "./dtos/sell-all.dto";
import { sleep } from "../@core/utils/sleep";
import { BuyAllSPLDto } from "./dtos/buy-all.dto";
import { AppService } from "../../app.service";
import {
  CreatePumpFunTokenDto,
  TokenBuyerDto,
} from "../solana-token/dtos/create-spl.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { PrismaService } from "../../prisma.service";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

@Controller("spl", {
  tags: ["spl-token"],
})
export class SolanaTokenController {
  private readonly logger = new Logger(SolanaTokenController.name);
  constructor(
    private prismaService: PrismaService,
    private readonly appService: AppService,
    private readonly solanaTokenService: SolanaTokenService,
    private readonly accountsService: AccountsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @Serializable(SolanaTokenDataEntity)
  @ApiOperation({
    summary: "Get token data",
    description: "This method returns token data",
  })
  @ApiOkResponse({
    description: "Token data",
    type: SolanaTokenDataEntity,
  })
  async getData() {
    return this.solanaTokenService.tokenData;
  }

  @Post()
  @Serializable(TransactionsResponseEntity)
  @ApiOperation({
    summary: "Create SPL token",
    description: "Creates PumpFun token",
  })
  @ApiOkResponse({
    description: "Hash",
    type: TransactionsResponseEntity,
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async createToken(
    @Body() payload: CreatePumpFunTokenDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { owner } = payload;
    payload.buyers = JSON.parse(`[${payload.buyers}]`) as TokenBuyerDto[];

    const buyersAccounts = await this.prismaService.account.findMany({
      where: {
        ...(payload.buyers
          ? {
              publicKey: {
                in: payload.buyers.map((buyer) => buyer.address),
              },
            }
          : {}),
        isActive: true,
        balance: { gt: 0.01 },
      },
    });

    const account = await this.accountsService.findOne(owner);

    if (!account) {
      throw new BadRequestException(`Account with id ${owner} not found`);
    }

    const creatorSecretKey = await this.accountsService.getSecretKey(
      account.id,
    );
    const creator = Keypair.fromSecretKey(bs58.decode(creatorSecretKey));

    let txHashes = [];

    const buyerToSolAmountMap = new Map<string, number>(
      payload.buyers.map((buyer) => [buyer.address, buyer.solAmount]),
    );

    try {
      const {
        txHashes: _txHashes,
        mint,
        bondingCurve,
        associatedBondingCurve,
      } = await this.solanaTokenService.create(
        creator,
        payload,
        file,
        buyersAccounts.map((account) => {
          const solAmount = buyerToSolAmountMap.get(account.publicKey);
          const amount = Math.min(account.balance, solAmount!);

          return {
            address: account.publicKey,
            solAmount: (amount * 80) / 100,
          };
        }),
      );

      // Update app config
      await this.appService.update({
        tokenId: mint.publicKey.toBase58(),
        bondingCurveId: bondingCurve.toBase58(),
        associatedBondingCurveId: associatedBondingCurve.toBase58(),
      });

      await this.prismaService.account.updateMany({
        data: {
          balance: 0,
          tokenBalance: 0,
          isTokenBalanceSynced: false,
          syncProblemInspectedAt: null,
          isBalanceSynced: false,
          tokenAccountId: null,
          isTokenAccountInitialized: false,
          lastBuyAt: null,
          lastSellAt: null,
        },
      });

      await this.prismaService.dcaSolanaAccount.updateMany({
        data: {
          canBuy: false,
          canSell: false,
          isActive: false,
        },
      });

      const allAccounts = await this.prismaService.account.findMany({
        select: {
          id: true,
          publicKey: true,
        },
      });

      for (const account of allAccounts) {
        await this.accountsService.update(account.id, {
          tokenAccountId: getAssociatedTokenAddressSync(
            mint.publicKey,
            new PublicKey(account.publicKey),
            true,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
          ).toBase58(),
        });
      }

      txHashes = _txHashes as any;
    } catch (error) {
      this.logger.error(error);

      console.log(
        await (error as SendTransactionError).getLogs(
          this.solanaTokenService.connection!,
        ),
      );

      throw new BadRequestException("Something went wrong");
    }

    return {
      txHashes,
    };
  }

  @Post("buy-all")
  @Serializable(TransactionsResponseEntity)
  @ApiOperation({
    summary: "Buy SPL tokens",
    description:
      "This method buys SPL tokens from all accounts, based on provided data",
  })
  @ApiOkResponse({
    description: "SPL tokens buy started!",
    type: TransactionsResponseEntity,
  })
  async buyAll(@Body() payload: BuyAllSPLDto) {
    const {
      keepSolanaAmount,
      percent,
      slippagePercent,
      priorityMicroLamptorsFee,
    } = payload;

    const config = await this.appService.getConfig();

    const accounts = await this.accountsService.findAll({
      withSecretKeys: true,
    });

    const txHashes: string[] = [];

    for (const { publicKey, balance, secretKey } of accounts) {
      try {
        if (keepSolanaAmount && balance < keepSolanaAmount) continue;

        const amountToBuy =
          (balance - (keepSolanaAmount ?? 0)) * (percent / 100);

        if (amountToBuy <= 0) continue;

        const txHash = await this.solanaTokenService.buy(
          Keypair.fromSecretKey(bs58.decode(secretKey)),
          amountToBuy,
          slippagePercent ?? 30,
          priorityMicroLamptorsFee ?? config!.priorityMicroLamptorsFee,
        );

        txHashes.push(txHash);

        this.eventEmitter.emit(
          SolanaTxCreatedEvent.id,
          new SolanaTxCreatedEvent({
            txHash,
            signerIds: [publicKey],
          }),
        );

        await this.accountsService.update(publicKey, {
          lastBuyAt: new Date(),
        });

        // Some sleep to avoid rate limit
        await sleep(200);
      } catch (error) {
        this.logger.error(error);
      }
    }

    return {
      txHashes,
    };
  }

  @Put("transfer-all")
  @Serializable(TransactionsResponseEntity)
  @ApiOperation({
    summary: "Transfer all SPL tokens to defined address",
    description:
      "This method transfers all SPL tokens to defined address. EVERYONE WILL BE KNOW WHO IS THE RECIPIENT AND WHAT HAPPENED",
  })
  @ApiOkResponse({
    description: "SPL tokens transfer started!",
    type: TransactionsResponseEntity,
  })
  async transferAll(
    @Body() payload: TransferAllDto,
  ): Promise<TransactionsResponseEntity> {
    const { address, priorityMicroLamptorsFee } = payload;

    const accounts = await this.accountsService.findAll({
      withSecretKeys: true,
    });

    const filteredByBalance = accounts.filter(
      (a) => a.balance > 0.00000535 && a.tokenBalance > 0,
    );

    const accountWithMostBalance = filteredByBalance.reduce(
      (acc, curr) => (curr.balance > acc.balance ? curr : acc),
      filteredByBalance?.[0],
    );

    const feePayer = Keypair.fromSecretKey(
      bs58.decode(accountWithMostBalance.secretKey),
    );

    const txHashes: string[] = [];

    try {
      const txHash = await this.solanaTokenService.transferAllFromManyToOne(
        feePayer,
        filteredByBalance.map((account) =>
          Keypair.fromSecretKey(bs58.decode(account.secretKey)),
        ),
        address,
        priorityMicroLamptorsFee,
      );

      this.eventEmitter.emit(
        SolanaTxCreatedEvent.id,
        new SolanaTxCreatedEvent({
          txHash,
          signerIds: [feePayer.publicKey.toBase58()],
        }),
      );

      txHashes.push(txHash);
    } catch (error) {
      this.logger.error(error);
    }

    return {
      txHashes,
    };
  }

  @Delete("sell-all")
  @Serializable(TransactionsResponseEntity)
  @ApiOperation({
    summary: "Sell all SPL tokens",
    description: "This method sells all SPL tokens, based on provided data",
  })
  @ApiOkResponse({
    description: "SPL tokens sell started!",
    type: TransactionsResponseEntity,
  })
  async sellAll(@Body() payload: SellAllSPLDto) {
    const { keepAmount, percent, slippagePercent, priorityMicroLamptorsFee } =
      payload;

    const config = await this.appService.getConfig();

    const accounts = await this.accountsService.findAll({
      withSecretKeys: true,
    });

    const txHashes: string[] = [];

    for (const { publicKey, tokenBalance, secretKey } of accounts) {
      try {
        if (keepAmount && tokenBalance < keepAmount) continue;

        const amountToSell =
          (tokenBalance - (keepAmount ?? 0)) * (percent / 100);

        if (amountToSell <= 0) continue;

        const txHash = await this.solanaTokenService.sell(
          Keypair.fromSecretKey(bs58.decode(secretKey)),
          amountToSell,
          slippagePercent ?? 30,
          true,
          priorityMicroLamptorsFee ?? config!.priorityMicroLamptorsFee,
        );

        txHashes.push(txHash);

        this.eventEmitter.emit(
          SolanaTxCreatedEvent.id,
          new SolanaTxCreatedEvent({
            txHash,
            signerIds: [publicKey],
          }),
        );

        await this.accountsService.update(publicKey, {
          lastSellAt: new Date(),
        });

        // Some sleep to avoid rate limit
        await sleep(200);
      } catch (error) {
        this.logger.error(error);
      }
    }

    return {
      txHashes,
    };
  }
}
