"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LetsBonkModule = void 0;
var common_1 = require("@nestjs/common");
var letsbonk_controller_1 = require("./letsbonk.controller");
var letsbonk_service_1 = require("./letsbonk.service");
var LetsBonkModule = /** @class */ (function () {
    function LetsBonkModule() {
    }
    LetsBonkModule = __decorate([
        (0, common_1.Module)({
            controllers: [letsbonk_controller_1.LetsBonkController],
            providers: [letsbonk_service_1.LetsBonkService],
            exports: [letsbonk_service_1.LetsBonkService],
        })
    ], LetsBonkModule);
    return LetsBonkModule;
}());
exports.LetsBonkModule = LetsBonkModule;
