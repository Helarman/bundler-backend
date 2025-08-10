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
exports.EncryptionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
let EncryptionService = class EncryptionService {
    constructor(configService) {
        this.configService = configService;
        this.algorithm = "aes-256-cbc";
    }
    key() {
        const envKey = this.configService.get("ENCRYPTION_KEY");
        if (!envKey) {
            throw Error('No key in env');
        }
        return (0, crypto_1.scryptSync)(envKey, "salt", 32);
    }
    iv() {
        return (0, crypto_1.randomBytes)(16);
    }
    encrypt(value) {
        const iv = this.iv();
        const utf8Value = Buffer.from(value, "utf-8");
        const cipher = (0, crypto_1.createCipheriv)(this.algorithm, this.key(), iv);
        return Buffer.concat([
            iv,
            cipher.update(utf8Value),
            cipher.final(),
        ]).toString("base64");
    }
    decrypt(value) {
        const buffer = Buffer.from(value, "base64");
        const iv = buffer.subarray(0, 16);
        const encrypted = buffer.subarray(16);
        const decipher = (0, crypto_1.createDecipheriv)(this.algorithm, this.key(), iv);
        return Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]).toString("utf-8");
    }
};
exports.EncryptionService = EncryptionService;
exports.EncryptionService = EncryptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EncryptionService);
