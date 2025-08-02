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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JitoController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jito_service_1 = require("./jito.service");
var send_bundle_dto_1 = require("./dto/send-bundle.dto");
var bundle_status_dto_1 = require("./dto/bundle-status.dto");
var proxy_request_dto_1 = require("./dto/proxy-request.dto");
var jito_response_dto_1 = require("./dto/jito-response.dto");
var JitoController = /** @class */ (function () {
    function JitoController(jitoService) {
        this.jitoService = jitoService;
    }
    JitoController.prototype.sendBundle = function (sendBundleDto) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.jitoService.sendBundle(sendBundleDto.transactions)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.formatResponse(result)];
                    case 2:
                        error_1 = _a.sent();
                        throw new common_1.HttpException(this.formatErrorResponse(error_1), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JitoController.prototype.getBundleStatus = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.jitoService.getBundleStatus(params.bundleId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.formatResponse(result)];
                    case 2:
                        error_2 = _a.sent();
                        throw new common_1.HttpException(this.formatErrorResponse(error_2), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JitoController.prototype.getTipAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.jitoService.getTipAccounts()];
                    case 1:
                        result = _a.sent();
                        response = this.formatResponse(result);
                        response.currentTipAccount = this.jitoService.getServiceInfo().tipAccount;
                        return [2 /*return*/, response];
                    case 2:
                        error_3 = _a.sent();
                        throw new common_1.HttpException(this.formatErrorResponse(error_3), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JitoController.prototype.proxyRequest = function (proxyRequestDto) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.jitoService.proxyRequest(proxyRequestDto.method, proxyRequestDto.params)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.formatResponse(result)];
                    case 2:
                        error_4 = _a.sent();
                        throw new common_1.HttpException(this.formatErrorResponse(error_4), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JitoController.prototype.getInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, {
                            success: true,
                            info: this.jitoService.getServiceInfo(),
                            message: 'Jito service information retrieved successfully',
                        }];
                }
                catch (error) {
                    throw new common_1.HttpException(this.formatErrorResponse(error), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return [2 /*return*/];
            });
        });
    };
    JitoController.prototype.formatResponse = function (result) {
        if (result.error) {
            return {
                success: false,
                error: result.error.message || 'Jito request failed',
                jitoError: result.error,
                message: 'Request completed with errors',
            };
        }
        return {
            success: true,
            result: result.result,
            message: 'Request completed successfully',
        };
    };
    JitoController.prototype.formatErrorResponse = function (error) {
        return {
            success: false,
            error: error.message || 'Internal server error',
            message: 'Request failed',
        };
    };
    __decorate([
        (0, common_1.Post)('send-bundle'),
        (0, swagger_1.ApiOperation)({ summary: 'Send bundle to Jito block engine' }),
        (0, swagger_1.ApiBody)({ type: send_bundle_dto_1.SendBundleDto }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.CREATED,
            type: jito_response_dto_1.JitoResponseDto,
        }),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [send_bundle_dto_1.SendBundleDto]),
        __metadata("design:returntype", Promise)
    ], JitoController.prototype, "sendBundle", null);
    __decorate([
        (0, common_1.Get)('bundle-status/:bundleId'),
        (0, swagger_1.ApiOperation)({ summary: 'Get bundle status from Jito' }),
        (0, swagger_1.ApiParam)({ name: 'bundleId', type: String }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.OK,
            type: jito_response_dto_1.JitoResponseDto,
        }),
        __param(0, (0, common_1.Param)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [bundle_status_dto_1.BundleStatusDto]),
        __metadata("design:returntype", Promise)
    ], JitoController.prototype, "getBundleStatus", null);
    __decorate([
        (0, common_1.Get)('tip-accounts'),
        (0, swagger_1.ApiOperation)({ summary: 'Get tip accounts from Jito' }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.OK,
            type: jito_response_dto_1.JitoResponseDto,
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], JitoController.prototype, "getTipAccounts", null);
    __decorate([
        (0, common_1.Post)('proxy'),
        (0, swagger_1.ApiOperation)({ summary: 'Proxy request to Jito' }),
        (0, swagger_1.ApiBody)({ type: proxy_request_dto_1.ProxyRequestDto }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.OK,
            type: jito_response_dto_1.JitoResponseDto,
        }),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [proxy_request_dto_1.ProxyRequestDto]),
        __metadata("design:returntype", Promise)
    ], JitoController.prototype, "proxyRequest", null);
    __decorate([
        (0, common_1.Get)('info'),
        (0, swagger_1.ApiOperation)({ summary: 'Get Jito service information' }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.OK,
            type: jito_response_dto_1.JitoResponseDto,
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], JitoController.prototype, "getInfo", null);
    JitoController = __decorate([
        (0, swagger_1.ApiTags)('Jito'),
        (0, common_1.Controller)('api/jito'),
        __metadata("design:paramtypes", [jito_service_1.JitoService])
    ], JitoController);
    return JitoController;
}());
exports.JitoController = JitoController;
