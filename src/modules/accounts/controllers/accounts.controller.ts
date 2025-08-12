import { Controller } from "../../@core/decorators/controller.decorator";
import { Serializable } from "../../@core/decorators/serializable.decorator";
import { UserFromJwt } from "../../@core/decorators/user.decorator";
import {
  BadRequestException,
  Body,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { CreateAccountDto } from "../dtos/create-account.dto";
import { TransferSolDto } from "../dtos/transfer-sol.dto";
import { UpdateAccountDto } from "../dtos/update-account.dto";
import { AccountEntity } from "../entities/account.entity";
import { SolanaTransactionEntity } from "../entities/transaction.entity";
import { AccountsService } from "../services/accounts.service";
import {
  SolanaSynchronizeAccountsEvent,
  SolanaTxCreatedEvent,
} from "../../solana/events/solana.events";
import { SolanaService } from "../../solana/services/solana.service";
import { UserService } from "../../user/user.service";
import * as bs58 from "bs58";
import { Keypair, PublicKey } from "@solana/web3.js";
import { ExportAccountDto } from "../dtos/export-account.dto";
import { ImportAccountDto } from "../dtos/import-account.dto";
import { UserEntity } from "../../user/entities/user.entity";
import { AuthService } from "../../auth/auth.service";
@Controller("accounts")
export class AccountsController {
  constructor(
    private service: AccountsService,
    private usersService: UserService,
    private readonly solanaService: SolanaService,
    private readonly eventEmitter: EventEmitter2,
    private authService: AuthService
  ) {}

  @Post("sync")
  @ApiOperation({
    summary: "Synchronize accounts with blockchain",
    description:
      "This method synchronize accounts with blockchain by getting accounts balance from RPC",
  })
  @ApiOkResponse()
  async sync() {
    this.eventEmitter.emit(
      SolanaSynchronizeAccountsEvent.id,
      new SolanaSynchronizeAccountsEvent()
    );
  return "OK";
}
  @Post("sync/all")
  @ApiOperation({
    summary: "Synchronize all accounts with blockchain",
    description:
      "This method synchronize all accounts with blockchain by getting accounts balance from RPC",
  })
  @ApiOkResponse()
  async syncAll() {
    this.eventEmitter.emit(
      SolanaSynchronizeAccountsEvent.id,
      new SolanaSynchronizeAccountsEvent({ type: "all" })
    );
    return "OK";
  }

  @Get()
  @Serializable(AccountEntity)
  @ApiOperation({ summary: "Get all accounts" })
  @ApiOkResponse({
    description: "Array of accounts",
    type: AccountEntity,
    isArray: true,
  })
  async findAll(): Promise<AccountEntity[]> {
    return await this.service.findAll();
  }

  @Put("import")
  @Serializable(AccountEntity)
  @ApiOperation({
    summary: "Import account",
    description:
      "WE CAN'T GUARANTEE THAT THE ACCOUNT WILL NOT LOST SINCE IT IS IMPORTED",
  })
  @ApiOkResponse({
    description: "Account",
    type: AccountEntity,
  })
  async import(
    @Body() payload: ImportAccountDto,
    @UserFromJwt() user: UserEntity,
  ) {
    return await this.service.import(payload, user.id);
  }

  @Get(":id")
  @Serializable(AccountEntity)
  @ApiOperation({ summary: "Get account by it's id" })
  @ApiOkResponse({
    description: "Account",
    type: AccountEntity,
  })
  @ApiNotFoundResponse({
    description: "Account not found",
  })
  async findOne(@Param("id") id: string): Promise<AccountEntity> {
    const account = await this.service.findOne(id);

    if (!account) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }

    return account;
  }

  @Post(":id/export")
  @ApiOperation({
    summary: "Export secret key of the account",
    description:
      "AFTER EXPORTING THE SECRET KEY WE CAN'T GUARANTEE THAT THE ACCOUNT WILL NOT LOST",
  })
  @ApiOkResponse({
    description: "Secret key of the solana account",
    type: String,
  })
  @ApiForbiddenResponse({
    description: "Invalid password",
  })
  async getSecretKey(
    @Param("id") id: string,
    @Body() payload: ExportAccountDto,
    @UserFromJwt() user: UserEntity,
  ): Promise<string> {
    const { password } = payload;
    if (!(await this.authService.validateUser(user.email, password))) {
      throw new ForbiddenException("Invalid password");
    }

    const secretKey = await this.service.getSecretKey(id);

    await this.service.update(id, {
      exportedAt: new Date(),
    });

    return secretKey;
  }

  @Post()
  @Serializable(AccountEntity)
  @ApiOperation({ summary: "Create new account" })
  @ApiCreatedResponse({
    description: "Account",
    type: AccountEntity,
  })
  create(@Body() payload: CreateAccountDto, @UserFromJwt() user: UserEntity) {
    return this.service.createRandomOne(payload, user.id);
  }

  @Put(":id/sol-transfer")
  @Serializable(SolanaTransactionEntity)
  @ApiOperation({
    summary: "Transfer SOL to account",
    description:
      "This method transfer SOL to account. EVERYONE WILL BE KNOW WHO IS THE RECIPIENT",
  })
  @ApiCreatedResponse({
    description: "Transaction",
    type: SolanaTransactionEntity,
  })
  async transferSol(@Param("id") id: string, @Body() payload: TransferSolDto) {
    const {
      percent,
      recipient,
      priorityMicroLamptorsFee,
      ignoreRecipientNotFound,
    } = payload;
    const account = await this.service.findOne(id);

    if (!account) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }

    if (!percent && !payload?.amount) {
      throw new BadRequestException("Percent or amount is required");
    }

    let amount = payload?.amount || 0;

    if (percent) {
      amount = account.balance * (percent / 100);
    }

    const secretKey = await this.service.getSecretKey(id);
    const txHash = await this.solanaService.transferSolana(
      Keypair.fromSecretKey(bs58.decode(secretKey)),
      new PublicKey(recipient),
      amount,
      priorityMicroLamptorsFee,
      ignoreRecipientNotFound,
    );

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

  @Patch(":id")
  @Serializable(AccountEntity)
  @ApiOperation({ summary: "Update account" })
  @ApiOkResponse({
    description: "Updated account",
    type: AccountEntity,
  })
  update(@Param("id") id: string, @Body() payload: UpdateAccountDto) {
    return this.service.update(id, payload);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remove account" })
  @ApiNoContentResponse({
    description: "Account removed",
  })
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
