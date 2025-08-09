import { Controller } from "../../@core/decorators/controller.decorator";
import {
  BadRequestException,
  Body,
  Delete,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { Keypair } from "@solana/web3.js";
import { BuyTokenDto } from "../dtos/buy-token.dto";
import { AccountsService } from "../services/accounts.service";
import { SolanaTokenService } from "../../solana-token/solana-token.service";
import * as bs58 from "bs58";
import { Serializable } from "../../@core/decorators/serializable.decorator";
import { SolanaTransactionEntity } from "../entities/transaction.entity";
import { SellTokenDto } from "../dtos/sell-token.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SolanaTxCreatedEvent } from "../../solana/events/solana.events";
import { TransferSplTokenDto } from "../dtos/transfer-token.dto";

@Controller("accounts/:accountId/spl", {
  tags: ["spl-token"],
})
export class AccountsSolanaController {
  constructor(
    private solanaTokenService: SolanaTokenService,
    private eventEmitter: EventEmitter2,
    private accountsService: AccountsService,
  ) {}

  @Post("buy")
  @Serializable(SolanaTransactionEntity)
  @ApiOperation({
    summary: "Buy SPL tokens",
    description: "Buy token for some amount of SOL",
  })
  @ApiOkResponse({
    description: "Transaction",
    type: SolanaTransactionEntity,
  })
  async buyToken(
    @Param("accountId") walletId: string,
    @Body() payload: BuyTokenDto,
  ): Promise<SolanaTransactionEntity> {
    const { solAmount, slippagePercent, priorityMicroLamptorsFee } = payload;

    const account = await this.accountsService.findOne(walletId);
    const secretKey = await this.accountsService.getSecretKey(account!.id);

    const wallet = Keypair.fromSecretKey(bs58.decode(secretKey));

    const txHash = await this.solanaTokenService.buy(
      wallet,
      solAmount,
      slippagePercent,
      priorityMicroLamptorsFee,
    );

    // Emit event
    this.eventEmitter.emit(
      SolanaTxCreatedEvent.id,
      new SolanaTxCreatedEvent({
        txHash,
        signerIds: [walletId],
      }),
    );

    await this.accountsService.update(account!.id, {
      lastBuyAt: new Date(),
    });

    return {
      txHash,
    };
  }

  @Delete("sell")
  @Serializable(SolanaTransactionEntity)
  @ApiOperation({
    summary: "Sell SPL tokens",
    description: "Sell token for some amount of SOL",
  })
  @ApiOkResponse({
    description: "Transaction",
    type: SolanaTransactionEntity,
  })
  async sellToken(
    @Param("accountId") walletId: string,
    @Body() payload: SellTokenDto,
  ) {
    const {
      tokenAmount,
      slippagePercent,
      skipLimit,
      priorityMicroLamptorsFee,
    } = payload;

    const account = await this.accountsService.findOne(walletId);
    const secretKey = await this.accountsService.getSecretKey(account!.id);

    const wallet = Keypair.fromSecretKey(bs58.decode(secretKey));

    const txHash = await this.solanaTokenService.sell(
      wallet,
      tokenAmount,
      slippagePercent,
      skipLimit,
      priorityMicroLamptorsFee,
    );

    // Emit event
    this.eventEmitter.emit(
      SolanaTxCreatedEvent.id,
      new SolanaTxCreatedEvent({
        txHash,
        signerIds: [walletId],
      }),
    );

    await this.accountsService.update(account!.id, {
      lastSellAt: new Date(),
    });

    return {
      txHash,
    };
  }

  @Put("transfer")
  @Serializable(SolanaTransactionEntity)
  @ApiOperation({
    summary: "Transfer SPL tokens",
    description: "Transfer SPL tokens to defined address",
  })
  @ApiOkResponse({
    description: "SPL tokens transfer started!",
    type: SolanaTransactionEntity,
  })
  async transferToken(
    @Param("accountId") accountId: string,
    @Body() payload: TransferSplTokenDto,
  ) {
    const { percent, recipient, priorityMicroLamptorsFee } = payload;

    const account = await this.accountsService.findOne(accountId);

    if (!account) {
      throw new BadRequestException(`Account with id ${accountId} not found`);
    }

    const secretKey = await this.accountsService.getSecretKey(account.id);

    const txHash = await this.solanaTokenService.transfer(
      Keypair.fromSecretKey(bs58.decode(secretKey)),
      recipient,
      percent,
      priorityMicroLamptorsFee,
    );

    // Emit event
    this.eventEmitter.emit(
      SolanaTxCreatedEvent.id,
      new SolanaTxCreatedEvent({
        txHash,
        signerIds: [account.publicKey],
      }),
    );

    return {
      txHash,
    };
  }
}
