"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaydiumSdkModule = void 0;
var common_1 = require("@nestjs/common");
var raydium_sdk_controller_1 = require("./raydium-sdk.controller");
var raydium_sdk_service_1 = require("./raydium-sdk.service");
var RaydiumSdkModule = /** @class */ (function () {
    function RaydiumSdkModule() {
    }
    RaydiumSdkModule = __decorate([
        (0, common_1.Module)({
            controllers: [raydium_sdk_controller_1.RaydiumSdkController],
            providers: [raydium_sdk_service_1.RaydiumSdkService],
            exports: [raydium_sdk_service_1.RaydiumSdkService],
        })
    ], RaydiumSdkModule);
    return RaydiumSdkModule;
}());
exports.RaydiumSdkModule = RaydiumSdkModule;
