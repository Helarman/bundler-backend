import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { App } from "@prisma/client";
import { UpdateAppDto } from "./app.dto";
import { AppEntity } from "./app.entity";
import { AppConfigUpdatedEvent } from "./app.events";
import { PrismaService } from "./prisma.service";

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  // Initialize config
  async onModuleInit() {
    const config = await this.getConfig();

    // Already initialized
    if (config) return;

    await this.prismaService.app.create({
      data: {
        tokenId: "",
        bondingCurveId: "",
        associatedBondingCurveId: "",
        balanceUsagePercent: 50,
      },
    });
  }

  async getConfig(): Promise<App | null> {
    return await this.prismaService.app.findFirst();
  }

  async isPanicSale() {
    return this.configService.get("PANIC_SALE") === "true";
  }

  async update(dto: UpdateAppDto): Promise<AppEntity> {
    const config = await this.getConfig();

    if (!config) throw new InternalServerErrorException();

    const updated = await this.prismaService.app.update({
      where: {
        id: config.id,
      },
      data: {
        ...dto,
      },
    });

    this.eventEmitter.emit(
      AppConfigUpdatedEvent.id,
      new AppConfigUpdatedEvent(updated),
    );

    return updated;
  }
}
