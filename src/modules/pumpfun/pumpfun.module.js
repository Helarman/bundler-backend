"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpfunModule = void 0;
var common_1 = require("@nestjs/common");
var pumpfun_controller_1 = require("./pumpfun.controller");
var pumpfun_service_1 = require("./pumpfun.service");
var jeton_module_1 = require("../jeton/jeton.module");
var PumpfunModule = /** @class */ (function () {
    function PumpfunModule() {
    }
    PumpfunModule = __decorate([
        (0, common_1.Module)({
            imports: [jeton_module_1.JetonModule],
            controllers: [pumpfun_controller_1.PumpfunController],
            providers: [pumpfun_service_1.PumpfunService],
        })
    ], PumpfunModule);
    return PumpfunModule;
}());
exports.PumpfunModule = PumpfunModule;
