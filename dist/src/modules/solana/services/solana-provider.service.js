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
exports.SolanaProviderService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const web3_js_1 = require("@solana/web3.js");
let SolanaProviderService = class SolanaProviderService {
    constructor(configService) {
        this.configService = configService;
        this.connection = null;
    }
    // public static prodRpcUrl = "https://api.devnet.solana.com";
    /**
     * Initializes the connection to the Solana cluster
     */
    async onModuleInit() {
        const rpcUrl = this.configService.get("SOLANA_URL");
        const wsEndpoint = this.configService.get("SOLANA_WSS_URL");
        this.connection = new web3_js_1.Connection(rpcUrl);
    }
    get config() {
        const rpcUrl = this.configService.get("SOLANA_URL");
        const wsEndpoint = this.configService.get("SOLANA_WSS_URL");
        return {
            rpcUrl,
            wsEndpoint,
        };
    }
    /**
     * Resets the connection to the Solana cluster
     */
    onModuleDestroy() {
        this.connection = null;
    }
    /**
     * Gets the balance of the wallet
     * @param wallet Id of the wallet
     * @returns
     */
    async getBalance(wallet) {
        const publicKey = new web3_js_1.PublicKey(wallet);
        const balance = await this.connection.getBalance(publicKey);
        return balance / web3_js_1.LAMPORTS_PER_SOL;
    }
};
exports.SolanaProviderService = SolanaProviderService;
SolanaProviderService.devRpcUrl = "https://api.devnet.solana.com";
SolanaProviderService.prodRpcUrl = "https://api.mainnet-beta.solana.com";
exports.SolanaProviderService = SolanaProviderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SolanaProviderService);
