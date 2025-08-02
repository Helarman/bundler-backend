"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JitoModule = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("@nestjs/axios");
var jito_controller_1 = require("./jito.controller");
var jito_service_1 = require("./jito.service");
var JitoModule = /** @class */ (function () {
    function JitoModule() {
    }
    JitoModule = __decorate([
        (0, common_1.Module)({
            imports: [axios_1.HttpModule],
            controllers: [jito_controller_1.JitoController],
            providers: [jito_service_1.JitoService],
            exports: [jito_service_1.JitoService],
        })
    ], JitoModule);
    return JitoModule;
}());
exports.JitoModule = JitoModule;
