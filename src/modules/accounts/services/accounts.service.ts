import * as base58 from "bs58";
import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Keypair } from "@solana/web3.js";
import { PrismaService } from "../../../prisma.service";
import { faker } from "@faker-js/faker";
import { EncryptionService } from "../../encryption/encryption.service";
import { AccountEntity } from "../entities/account.entity";
import { CreateAccountDto } from "../dtos/create-account.dto";
import { UpdateAccountDto } from "../dtos/update-account.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AccountCreatedEvent } from "../events/accounts.events";
import { ImportAccountDto } from "../dtos/import-account.dto";
import * as bs58 from "bs58";
import { SolanaService } from "../../solana/services/solana.service";

@Injectable()
export class AccountsService {
  constructor(
    private db: PrismaService,
    private solanaService: SolanaService,
    private encryptionService: EncryptionService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async isTokenAccountInitialized(tokenAccountId: string): Promise<boolean> {
    const tokenAccount = await this.db.account.findFirst({
      where: {
        tokenAccountId,
      },
    });

    if (!tokenAccount) return false;

    return tokenAccount.isTokenAccountInitialized;
  }

  async import(dto: ImportAccountDto, userId?: string): Promise<AccountEntity> {
    const account = Keypair.fromSecretKey(
      typeof dto.secretKey === "string"
        ? bs58.decode(dto.secretKey)
        : new Uint8Array(dto.secretKey),
    );

    const accountInfo = await this.solanaService.connection!.getAccountInfo(
      account.publicKey,
    );

    if (!accountInfo) {
      throw new BadRequestException("Account not found");
    }

    if (!userId) throw new BadRequestException("User ID is required");
    
    const data = await this.db.account.create({
      data: {
        ...dto,
        publicKey: account.publicKey.toBase58(),
        secretKey: this.encryptionService.encrypt(
          base58.encode(account.secretKey),
        ),
        name: "IMPORT-" + faker.internet.userName(),
        color: "#ff0000" ,
        isImported: true,
        userId,
        isActive: true,
      },
    });

    this.eventEmitter.emit(
      AccountCreatedEvent.id,
      new AccountCreatedEvent(data),
    );

    return data;
  }

  async createRandomOne(
    dto?: CreateAccountDto,
    userId?: string,
  ): Promise<any> {
    if (!userId) throw new BadRequestException("User ID is required");

    try {
      const keypair = Keypair.generate();
      const publicKey = keypair.publicKey.toBase58();
      
      const existingAccount = await this.db.account.findUnique({
        where: { publicKey },
      });
      if (existingAccount) {
        throw new BadRequestException("Account with this publicKey already exists");
      }

      const secretKey = Buffer.from(keypair.secretKey).toString('hex')


      const account = await this.db.account.create({
        data: {
          name: faker.internet.userName(),
          color: faker.color.rgb(),
          publicKey,
          secretKey,
          isActive: true,
          userId,
          ...(dto || {}),
        },
      });

      this.eventEmitter.emit(
        AccountCreatedEvent.id,
        new AccountCreatedEvent(account),
      );

      return account;
    } catch (error) {
      console.error("Account creation failed:", error instanceof Error ? error.message : String(error));
      throw new InternalServerErrorException("Failed to create account");
    }
  }
  
  async findAll(options?: {
    withSecretKeys?: boolean;
  }): Promise<AccountEntity[]> {
    const { withSecretKeys } = options || {};
    let accounts = await this.db.account.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (withSecretKeys) {
      accounts = accounts.map((account) => ({
        ...account,
      }));
    }

    return accounts;
  }

  async findOne(id: string): Promise<AccountEntity | null> {
    return await this.db.account.findFirst({
      where: {
        OR: [
          {
            id,
          },
          {
            publicKey: id,
          },
        ],
      },
    });
  }

  async getSecretKey(id: string): Promise<string> {
    const account = await this.findOne(id);
    
    return account!.secretKey;
  }

  async update(
    id: string,
    dto?: UpdateAccountDto,
  ): Promise<AccountEntity | null> {
    const account = await this.findOne(id);

    if (!account) return null;

    return await this.db.account.update({
      where: {
        id: account.id,
      },
      data: {
        ...dto,
      },
    });
  }

  async updateByTokenAccount(tokenAccountId: string, dto?: UpdateAccountDto) {
    const account = await this.db.account.findFirst({
      where: {
        tokenAccountId,
      },
    });

    if (!account) return null;

    return await this.db.account.update({
      where: {
        id: account.id,
      },
      data: {
        ...dto,
      },
    });
  }

  async remove(id: string) {
    return await this.db.account.update({
      where: {
        id,
      },
      data: {
        isRemoved: true,
        removedAt: new Date(),
      },
    });
  }
}
