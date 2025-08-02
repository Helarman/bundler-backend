"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
var common_1 = require("@nestjs/common");
var common_2 = require("@nestjs/common");
var HttpExceptionFilter = /** @class */ (function () {
    function HttpExceptionFilter() {
        this.logger = new common_2.Logger(HttpExceptionFilter_1.name);
    }
    HttpExceptionFilter_1 = HttpExceptionFilter;
    HttpExceptionFilter.prototype.catch = function (exception, host) {
        var ctx = host.switchToHttp();
        var response = ctx.getResponse();
        var request = ctx.getRequest();
        var status = exception.getStatus();
        var exceptionResponse = exception.getResponse();
        var errorResponse = {
            success: false,
            error: typeof exceptionResponse === 'object'
                ? exceptionResponse.message || exceptionResponse
                : exceptionResponse,
            code: exception.name,
            path: request.url,
            timestamp: new Date().toISOString(),
        };
        this.logger.error("".concat(request.method, " ").concat(request.url, " ").concat(status), exception.stack, 'ExceptionFilter');
        response.status(status).json(errorResponse);
    };
    var HttpExceptionFilter_1;
    HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
        (0, common_1.Catch)(common_1.HttpException)
    ], HttpExceptionFilter);
    return HttpExceptionFilter;
}());
exports.HttpExceptionFilter = HttpExceptionFilter;
