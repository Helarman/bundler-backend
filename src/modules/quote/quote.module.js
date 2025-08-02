"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteModule = void 0;
var common_1 = require("@nestjs/common");
var quote_controller_1 = require("./quote.controller");
var quote_service_1 = require("./quote.service");
var jeton_module_1 = require("../jeton/jeton.module");
var QuoteModule = /** @class */ (function () {
    function QuoteModule() {
    }
    QuoteModule = __decorate([
        (0, common_1.Module)({
            imports: [jeton_module_1.JetonModule],
            controllers: [quote_controller_1.QuoteController],
            providers: [quote_service_1.QuoteService],
        })
    ], QuoteModule);
    return QuoteModule;
}());
exports.QuoteModule = QuoteModule;
