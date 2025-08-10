"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const app_events_1 = require("./app.events");
const prisma_service_1 = require("./prisma.service");
let AppService = class AppService {
    constructor(configService, prismaService, eventEmitter) {
        this.configService = configService;
        this.prismaService = prismaService;
        this.eventEmitter = eventEmitter;
    }
    // Initialize config
    async onModuleInit() {
        const config = await this.getConfig();
        // Already initialized
        if (config)
            return;
        await this.prismaService.app.create({
            data: {
                tokenId: "",
                bondingCurveId: "",
                associatedBondingCurveId: "",
                balanceUsagePercent: 50,
            },
        });
    }
    async getConfig() {
        return await this.prismaService.app.findFirst();
    }
    async isPanicSale() {
        return this.configService.get("PANIC_SALE") === "true";
    }
    async update(dto) {
        const config = await this.getConfig();
        if (!config)
            throw new common_1.InternalServerErrorException();
        const updated = await this.prismaService.app.update({
            where: {
                id: config.id,
            },
            data: {
                ...dto,
            },
        });
        this.eventEmitter.emit(app_events_1.AppConfigUpdatedEvent.id, new app_events_1.AppConfigUpdatedEvent(updated));
        return updated;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], AppService);
