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
exports.SerializationInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const class_transformer_1 = require("class-transformer");
/**
 * Serialization interceptor transforms response by filtering only exposed properties
 * @see [Interceptors - NestJS](https://docs.nestjs.com/interceptors)
 */
let SerializationInterceptor = class SerializationInterceptor {
    constructor(defaultClass) {
        this.defaultClass = defaultClass;
        /**
         * Parameters of transformation
         */
        this.options = {
            excludeExtraneousValues: true,
        };
    }
    /**
     * Implements interception logic
     * @param context Execution context which describes current request pipeline
     * @param next Object which provides access to response RxJS stream
     */
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (!data || typeof data !== "object") {
                return data;
            }
            return (0, class_transformer_1.plainToInstance)(this.defaultClass, data, this.options);
        }));
    }
};
exports.SerializationInterceptor = SerializationInterceptor;
exports.SerializationInterceptor = SerializationInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], SerializationInterceptor);
