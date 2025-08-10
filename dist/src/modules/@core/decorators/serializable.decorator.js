"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serializable = Serializable;
const common_1 = require("@nestjs/common");
const serialization_interceptor_1 = require("../interceptors/serialization.interceptor");
/**
 * Method decorator which transforms response by filtering only exposed properties
 * @see [Decorator composition - NestJS](https://docs.nestjs.com/custom-decorators#decorator-composition)
 * @param entity Constructor of class to which the method response must satisfy
 */
function Serializable(entity) {
    return (0, common_1.applyDecorators)((0, common_1.UseInterceptors)(new serialization_interceptor_1.SerializationInterceptor(entity)));
}
