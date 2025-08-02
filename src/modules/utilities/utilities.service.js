"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilitiesService = void 0;
var common_1 = require("@nestjs/common");
var web3_js_1 = require("@solana/web3.js");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var UtilitiesService = /** @class */ (function () {
    function UtilitiesService() {
        this.logger = new common_1.Logger(UtilitiesService_1.name);
        this.uploadDir = path.join(__dirname, '../../../uploads');
        this.ensureUploadDirectoryExists();
    }
    UtilitiesService_1 = UtilitiesService;
    UtilitiesService.prototype.ensureUploadDirectoryExists = function () {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    };
    UtilitiesService.prototype.generateMintAddress = function () {
        this.logger.log('Generate mint request received');
        try {
            var mintKeypair = web3_js_1.Keypair.generate();
            var mintAddress = mintKeypair.publicKey.toBase58();
            this.logger.log("Mint address generated: ".concat(mintAddress));
            return {
                success: true,
                pubkey: mintAddress,
                message: 'Mint address generated successfully'
            };
        }
        catch (error) {
            this.logger.error('Error generating mint address:', error);
            throw new Error('Failed to generate mint address');
        }
    };
    UtilitiesService.prototype.handleFileUpload = function (file) {
        this.logger.log('Image upload request received');
        if (!file) {
            throw new Error('No image file provided');
        }
        var fileUrl = "/uploads/".concat(file.filename);
        this.logger.log('Image uploaded successfully', {
            filename: file.filename,
            originalname: file.originalname,
            size: file.size,
            url: fileUrl
        });
        return {
            success: true,
            url: fileUrl,
            filename: file.filename,
            originalname: file.originalname,
            size: file.size,
            message: 'Image uploaded successfully'
        };
    };
    UtilitiesService.prototype.checkHealth = function () {
        return {
            success: true,
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                solana: 'connected',
                jito: 'available'
            }
        };
    };
    var UtilitiesService_1;
    UtilitiesService = UtilitiesService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [])
    ], UtilitiesService);
    return UtilitiesService;
}());
exports.UtilitiesService = UtilitiesService;
