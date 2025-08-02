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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JitoService = void 0;
var common_1 = require("@nestjs/common");
var jito_constants_1 = require("./constants/jito.constants");
var node_fetch_1 = __importDefault(require("node-fetch"));
var JitoService = /** @class */ (function () {
    function JitoService() {
        this.logger = new common_1.Logger(JitoService_1.name);
        this.endpoint = jito_constants_1.JITO_CONFIG.endpoint;
        this.tipAccount = jito_constants_1.JITO_CONFIG.tipAccount;
        this.logger.log('JitoService initialized', {
            endpoint: this.endpoint,
            tipAccount: this.tipAccount,
        });
    }
    JitoService_1 = JitoService;
    JitoService.prototype.sendBundle = function (transactions) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log('Sending bundle to Jito', {
                            transactionCount: transactions.length,
                        });
                        return [4 /*yield*/, (0, node_fetch_1.default)("".concat(this.endpoint, "/bundles"), {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    jsonrpc: '2.0',
                                    id: Date.now(),
                                    method: 'sendBundle',
                                    params: [transactions],
                                }),
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.handleResponse(response)];
                    case 2:
                        error_1 = _a.sent();
                        this.logger.error('Jito bundle send error', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JitoService.prototype.getBundleStatus = function (bundleId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log('Getting bundle status from Jito', { bundleId: bundleId });
                        return [4 /*yield*/, (0, node_fetch_1.default)("".concat(this.endpoint, "/bundles"), {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    jsonrpc: '2.0',
                                    id: Date.now(),
                                    method: 'getBundleStatuses',
                                    params: [[bundleId]],
                                }),
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.handleResponse(response)];
                    case 2:
                        error_2 = _a.sent();
                        this.logger.error('Jito bundle status error', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JitoService.prototype.getTipAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log('Getting tip accounts from Jito');
                        return [4 /*yield*/, (0, node_fetch_1.default)("".concat(this.endpoint, "/bundles"), {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    jsonrpc: '2.0',
                                    id: Date.now(),
                                    method: 'getTipAccounts',
                                    params: [],
                                }),
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.handleResponse(response)];
                    case 2:
                        error_3 = _a.sent();
                        this.logger.error('Jito tip accounts error', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JitoService.prototype.proxyRequest = function (method_1) {
        return __awaiter(this, arguments, void 0, function (method, params) {
            var response, error_4;
            if (params === void 0) { params = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log('Proxying Jito request', { method: method, params: params });
                        return [4 /*yield*/, (0, node_fetch_1.default)("".concat(this.endpoint, "/bundles"), {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    jsonrpc: '2.0',
                                    id: Date.now(),
                                    method: method,
                                    params: params,
                                }),
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.handleResponse(response)];
                    case 2:
                        error_4 = _a.sent();
                        this.logger.error('Jito proxy request error', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JitoService.prototype.getServiceInfo = function () {
        return {
            endpoint: this.endpoint,
            tipAccount: this.tipAccount,
            availableMethods: [
                'sendBundle',
                'getBundleStatuses',
                'getTipAccounts',
            ],
        };
    };
    JitoService.prototype.handleResponse = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var errorText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!response.ok) return [3 /*break*/, 2];
                        return [4 /*yield*/, response.text()];
                    case 1:
                        errorText = _a.sent();
                        throw new Error("Jito request failed: ".concat(response.status, " - ").concat(errorText));
                    case 2: return [2 /*return*/, response.json()];
                }
            });
        });
    };
    var JitoService_1;
    JitoService = JitoService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [])
    ], JitoService);
    return JitoService;
}());
exports.JitoService = JitoService;
