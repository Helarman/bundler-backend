import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AccountCreatedEvent } from "../../accounts/events/accounts.events";
import { PrismaService } from "../../../prisma.service";
import { UpdateDcaAccountDto } from "../dtos/update-dca-account.dto";

@Injectable()
export class SolanaDcaService {
  constructor(private prismaService: PrismaService) {}

  async onModuleInit() {
    await this._createUncreatedAccounts();
  }

  /**
   * Called when new account is created
   * @param account
   */
  @OnEvent(AccountCreatedEvent.id)
  private async _onNewAccountCreated() {
    await this._createUncreatedAccounts();
  }

  /**
   * Created DCA accounts that are not created yet
   * @returns
   */
  private async _createUncreatedAccounts() {
    const accounts = await this.prismaService.account.findMany();
    const dcaAccounts = await this.prismaService.dcaSolanaAccount.findMany();

    const dcaAccountsIdsSet = new Set(
      dcaAccounts.map((account) => account.accountId),
    );

    const accountIdsToCreate = accounts.reduce((acc, curr) => {
      const { publicKey } = curr;

      if (!dcaAccountsIdsSet.has(publicKey)) {
        acc.push(publicKey);
      }

      return acc;
    }, [] as string[]);

    if (accountIdsToCreate.length === 0) return;

    await this.prismaService.dcaSolanaAccount.createMany({
      data: accountIdsToCreate.map((accountId) => ({
        accountId,
        maxTokenPrice: 0,
        minTokenPrice: 0,
        isActive: false,
      })),
    });
  }

  async getAccounts() {
    return await this.prismaService.dcaSolanaAccount.findMany({
      orderBy: {
        accountId: "asc",
      },
    });
  }

  async getLoopAccounts() {
    return await this.prismaService.dcaSolanaAccount.findMany({
      where: {
        isActive: true,
        account: {
          OR: [
            {
              isBalanceSynced: true,
              isTokenBalanceSynced: true,
              isActive: true,
            },
            {
              isBalanceSynced: true,
              isTokenBalanceSynced: false,
              isTokenAccountInitialized: false,
              isActive: true,
            },
          ],
        },
      },
      include: {
        account: true,
      },
    });
  }

  async saveBuyDate(accountId: string) {
    const account = await this.prismaService.account.findFirst({
      where: {
        OR: [{ id: accountId }, { publicKey: accountId }],
      },
    });

    if (!account) return;

    return await this.prismaService.account.update({
      where: {
        id: account.id,
      },
      data: {
        lastBuyAt: new Date(),
      },
    });
  }

  async saveSellDate(accountId: string) {
    const account = await this.prismaService.account.findFirst({
      where: {
        OR: [{ id: accountId }, { publicKey: accountId }],
      },
    });

    if (!account) return;

    return await this.prismaService.account.update({
      where: {
        id: account.id,
      },
      data: {
        lastSellAt: new Date(),
      },
    });
  }

  async updateAccount(id: string, dto: UpdateDcaAccountDto) {
    return await this.prismaService.dcaSolanaAccount.update({
      where: {
        accountId: id,
      },
      data: {
        ...dto,
      },
    });
  }

  async updateAllAccounts(dto: UpdateDcaAccountDto) {
    await this.prismaService.dcaSolanaAccount.updateMany({
      data: {
        ...dto,
      },
    });

    return await this.getAccounts();
  }
}
