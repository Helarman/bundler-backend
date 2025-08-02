"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaydiumModule = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("@nestjs/axios");
var cache_manager_1 = require("@nestjs/cache-manager");
var raydium_service_1 = require("./raydium.service");
var raydium_controller_1 = require("./raydium.controller");
var RaydiumModule = /** @class */ (function () {
    function RaydiumModule() {
    }
    RaydiumModule = __decorate([
        (0, common_1.Module)({
            imports: [
                axios_1.HttpModule,
                cache_manager_1.CacheModule.register({
                    ttl: 60 * 1000,
                    max: 1000
                })
            ],
            providers: [raydium_service_1.RaydiumService],
            controllers: [raydium_controller_1.RaydiumController],
            exports: [raydium_service_1.RaydiumService]
        })
    ], RaydiumModule);
    return RaydiumModule;
}());
exports.RaydiumModule = RaydiumModule;
