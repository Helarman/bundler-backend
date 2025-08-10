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
exports.SolanaController = void 0;
const controller_decorator_1 = require("../@core/decorators/controller.decorator");
const accounts_service_1 = require("../accounts/services/accounts.service");
const solana_service_1 = require("./services/solana.service");
let SolanaController = class SolanaController {
    constructor(service, accountsService) {
        this.service = service;
        this.accountsService = accountsService;
    }
};
exports.SolanaController = SolanaController;
exports.SolanaController = SolanaController = __decorate([
    (0, controller_decorator_1.Controller)("solana"),
    __metadata("design:paramtypes", [solana_service_1.SolanaService,
        accounts_service_1.AccountsService])
], SolanaController);
