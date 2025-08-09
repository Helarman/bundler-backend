import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../prisma.service";

@Injectable()
export class SolanaTransactionsService {
  constructor(private prisma: PrismaService) {}

  async get(txHash: string) {
    return await this.prisma.solanaTx.findUnique({
      where: {
        txHash,
      },
    });
  }

  async getLastForSigner(signerId: string) {
    return await this.prisma.solanaTx.findFirst({
      where: {
        signerIds: {
          has: signerId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getOngoing() {
    return await this.prisma.solanaTx.findMany({
      where: {
        isConfirmed: false,
        isFailed: false,
      },
    });
  }

  async getOngoingSignerIds() {
    const txs = await this.getOngoing();

    return [...new Set(txs.map((tx) => tx.signerIds).flat())];
  }

  async create(data: Prisma.SolanaTxCreateInput) {
    return await this.prisma.solanaTx.create({
      data,
    });
  }

  async update(txHash: string, data: Partial<Prisma.SolanaTxUpdateInput>) {
    return await this.prisma.solanaTx.update({
      where: {
        txHash,
      },
      data,
    });
  }

  async failTx(txHash: string) {
    return await this.prisma.solanaTx.update({
      where: {
        txHash,
      },
      data: {
        isFailed: true,
        failedAt: new Date(),
      },
    });
  }

  async confirmTx(txHash: string) {
    return await this.prisma.solanaTx.update({
      where: {
        txHash,
      },
      data: {
        isConfirmed: true,
        confirmedAt: new Date(),
      },
    });
  }
}
