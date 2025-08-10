"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFromJwt = exports.JwtUserEntity = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../user/entities/user.entity");
class JwtUserEntity extends (0, swagger_1.PickType)(user_entity_1.UserEntity, ["id"]) {
}
exports.JwtUserEntity = JwtUserEntity;
/**
 * Parameter decorator which provides user object from request
 * @see [Param decorators - NestJS](https://docs.nestjs.com/custom-decorators#param-decorators)
 */
exports.UserFromJwt = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
