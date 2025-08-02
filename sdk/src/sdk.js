"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JetonSDK = void 0;
var utils_1 = require("./utils");
var distribute_1 = require("./functions/distribute");
var mixer_1 = require("./functions/mixer");
var tokenBuy_1 = require("./functions/tokenBuy");
var tokenSell_1 = require("./functions/tokenSell");
var consolidate_1 = require("./functions/consolidate");
var routeQuote_1 = require("./functions/routeQuote");
var transfer_1 = require("./functions/transfer");
var create_1 = require("./functions/create");
var burn_1 = require("./functions/burn");
/**
 * Main JetonSDK class providing access to all Solana transaction operations
 */
var JetonSDK = /** @class */ (function () {
    /**
     * Initialize the SDK with configuration
     */
    function JetonSDK(config) {
        (0, utils_1.configure)(config);
    }
    /**
     * Update SDK configuration
     */
    JetonSDK.prototype.configure = function (config) {
        (0, utils_1.configure)(config);
    };
    /**
     * Get current SDK configuration
     */
    JetonSDK.prototype.getConfig = function () {
        return (0, utils_1.getConfig)();
    };
    /**
     * Validate distribution inputs before executing
     */
    JetonSDK.prototype.validateDistribution = function (senderWallet, recipientWallets, senderBalance) {
        return (0, distribute_1.validateDistributionInputs)(senderWallet, recipientWallets, senderBalance);
    };
    /**
     * Distribute SOL to multiple recipients
     */
    JetonSDK.prototype.distributeSOL = function (senderWallet, recipientWallets) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, distribute_1.distributeSOL)(senderWallet, recipientWallets)];
            });
        });
    };
    /**
     * Batch distribute SOL to multiple recipients with automatic batching
     */
    JetonSDK.prototype.batchDistributeSOL = function (senderWallet, recipientWallets) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, distribute_1.batchDistributeSOL)(senderWallet, recipientWallets)];
            });
        });
    };
    /**
     * Validate mixing inputs before executing
     */
    JetonSDK.prototype.validateMixing = function (senderWallet, recipientWallets, senderBalance) {
        return (0, mixer_1.validateMixingInputs)(senderWallet, recipientWallets, senderBalance);
    };
    /**
     * Validate single recipient mixing inputs before executing
     */
    JetonSDK.prototype.validateSingleMixing = function (senderWallet, recipientWallet, senderBalance) {
        return (0, mixer_1.validateSingleMixingInputs)(senderWallet, recipientWallet, senderBalance);
    };
    /**
     * Mix SOL to a single recipient (optimized)
     */
    JetonSDK.prototype.mixSOLToSingleRecipient = function (senderWallet, recipientWallet) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, mixer_1.mixSOLToSingleRecipient)(senderWallet, recipientWallet)];
            });
        });
    };
    /**
     * Batch mix SOL to multiple recipients, processing one recipient at a time
     */
    JetonSDK.prototype.batchMixSOL = function (senderWallet, recipientWallets) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, mixer_1.batchMixSOL)(senderWallet, recipientWallets)];
            });
        });
    };
    /**
     * Validate token buy inputs before executing
     */
    JetonSDK.prototype.validateTokenBuy = function (wallets, tokenConfig) {
        return (0, tokenBuy_1.validateTokenBuyInputs)(wallets, tokenConfig);
    };
    /**
     * Buy tokens for a single wallet
     */
    JetonSDK.prototype.buyTokenSingle = function (wallet, tokenConfig) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, tokenBuy_1.buyTokenSingle)(wallet, tokenConfig)];
            });
        });
    };
    /**
     * Buy tokens for multiple wallets (batch)
     */
    JetonSDK.prototype.buyTokenBatch = function (wallets, tokenConfig, customAmounts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, tokenBuy_1.buyTokenBatch)(wallets, tokenConfig, customAmounts)];
            });
        });
    };
    /**
     * Validate token sell inputs before executing
     */
    JetonSDK.prototype.validateTokenSell = function (wallets, tokenConfig) {
        return (0, tokenSell_1.validateTokenSellInputs)(wallets, tokenConfig);
    };
    /**
     * Sell tokens for a single wallet
     */
    JetonSDK.prototype.sellTokenSingle = function (wallet, tokenConfig) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, tokenSell_1.sellTokenSingle)(wallet, tokenConfig)];
            });
        });
    };
    /**
     * Sell tokens for multiple wallets (batch)
     */
    JetonSDK.prototype.sellTokenBatch = function (wallets, tokenConfig, customPercentages) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, tokenSell_1.sellTokenBatch)(wallets, tokenConfig, customPercentages)];
            });
        });
    };
    /**
     * Validate consolidation inputs before executing
     */
    JetonSDK.prototype.validateConsolidation = function (sourceWallets, receiverWallet, percentage, sourceBalances) {
        return (0, consolidate_1.validateConsolidationInputs)(sourceWallets, receiverWallet, percentage, sourceBalances);
    };
    /**
     * Consolidate SOL from multiple source wallets to a single receiver wallet
     */
    JetonSDK.prototype.consolidateSOL = function (sourceWallets, receiverWallet, percentage) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, consolidate_1.consolidateSOL)(sourceWallets, receiverWallet, percentage)];
            });
        });
    };
    /**
     * Validate route quote inputs before executing
     */
    JetonSDK.prototype.validateRouteQuote = function (config) {
        return (0, routeQuote_1.validateRouteQuoteInputs)(config);
    };
    /**
     * Get route quote for token buy/sell operations
     */
    JetonSDK.prototype.getRouteQuote = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, routeQuote_1.getRouteQuote)(config)];
            });
        });
    };
    /**
     * Get a buy quote for a specific token (convenience method)
     * @param tokenMintAddress - The token mint address
     * @param solAmount - Amount of SOL to spend
     * @param rpcUrl - Optional RPC URL override
     */
    JetonSDK.prototype.getBuyQuote = function (tokenMintAddress, solAmount, rpcUrl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, routeQuote_1.getBuyQuote)(tokenMintAddress, solAmount, rpcUrl)];
            });
        });
    };
    /**
     * Get a sell quote for a specific token (convenience method)
     * @param tokenMintAddress - The token mint address
     * @param tokenAmount - Amount of tokens to sell
     * @param rpcUrl - Optional RPC URL override
     */
    JetonSDK.prototype.getSellQuote = function (tokenMintAddress, tokenAmount, rpcUrl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, routeQuote_1.getSellQuote)(tokenMintAddress, tokenAmount, rpcUrl)];
            });
        });
    };
    /**
     * Validate transfer inputs before executing
     */
    JetonSDK.prototype.validateTransfer = function (senderWallet, receiverAddress, amount, tokenAddress) {
        return (0, transfer_1.validateTransferInputs)(senderWallet, receiverAddress, amount, tokenAddress);
    };
    /**
     * Transfer SOL or tokens to a recipient
     */
    JetonSDK.prototype.transferTokens = function (senderWallet, receiverAddress, amount, tokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, transfer_1.transferTokens)(senderWallet, receiverAddress, amount, tokenAddress)];
            });
        });
    };
    /**
     * Transfer SOL to a recipient (convenience method)
     */
    JetonSDK.prototype.transferSOL = function (senderWallet, recipientAddress, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, transfer_1.transferSOL)(senderWallet, recipientAddress, amount)];
            });
        });
    };
    /**
     * Transfer tokens to a recipient (convenience method)
     */
    JetonSDK.prototype.transferToken = function (senderWallet, recipientAddress, tokenMint, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, transfer_1.transferToken)(senderWallet, recipientAddress, tokenMint, amount)];
            });
        });
    };
    /**
     * Execute multiple transfers in sequence
     */
    JetonSDK.prototype.batchTransfer = function (senderWallet, transfers) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, transfer_1.batchTransfer)(senderWallet, transfers)];
            });
        });
    };
    /**
     * Validate token creation inputs before executing
     */
    JetonSDK.prototype.validateTokenCreate = function (wallets, config) {
        return (0, create_1.validateTokenCreateInputs)(wallets, config);
    };
    /**
     * Create a token on the specified platform
     */
    JetonSDK.prototype.createTokenSingle = function (wallets, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, create_1.createTokenSingle)(wallets, config)];
            });
        });
    };
    /**
     * Create multiple tokens in batch with different configurations
     */
    JetonSDK.prototype.createTokenBatch = function (walletConfigs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, create_1.createTokenBatch)(walletConfigs)];
            });
        });
    };
    /**
     * Validate token burn inputs before executing
     */
    JetonSDK.prototype.validateTokenBurn = function (wallet, tokenAddress, amount) {
        return (0, burn_1.validateBurnInputs)(wallet, tokenAddress, amount);
    };
    /**
     * Burn tokens from a wallet
     */
    JetonSDK.prototype.burnToken = function (wallet, tokenAddress, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, burn_1.burnToken)(wallet, tokenAddress, amount)];
            });
        });
    };
    /**
     * Burn multiple tokens in batch
     */
    JetonSDK.prototype.batchBurnToken = function (wallet, burns) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, burn_1.batchBurnToken)(wallet, burns)];
            });
        });
    };
    return JetonSDK;
}());
exports.JetonSDK = JetonSDK;
