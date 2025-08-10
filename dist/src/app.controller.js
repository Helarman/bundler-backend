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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const controller_decorator_1 = require("./modules/@core/decorators/controller.decorator");
const serializable_decorator_1 = require("./modules/@core/decorators/serializable.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_dto_1 = require("./app.dto");
const app_entity_1 = require("./app.entity");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async getConfig() {
        return await this.appService.getConfig();
    }
    async updateConfig(payload) {
        return await this.appService.update(payload);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, serializable_decorator_1.Serializable)(app_entity_1.AppEntity),
    (0, swagger_1.ApiOperation)({ summary: "Get app config" }),
    (0, swagger_1.ApiOkResponse)({
        description: "App config",
        type: app_entity_1.AppEntity,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Patch)(),
    (0, serializable_decorator_1.Serializable)(app_entity_1.AppEntity),
    (0, swagger_1.ApiOperation)({ summary: "Update app config" }),
    (0, swagger_1.ApiOkResponse)({
        description: "App config",
        type: app_entity_1.AppEntity,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_dto_1.UpdateAppDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateConfig", null);
exports.AppController = AppController = __decorate([
    (0, controller_decorator_1.Controller)("app"),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
