import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { PickType } from "@nestjs/swagger";
import { UserEntity } from "../../user/entities/user.entity";

export class JwtUserEntity extends PickType(UserEntity, ["id"]) {}

/**
 * Parameter decorator which provides user object from request
 * @see [Param decorators - NestJS](https://docs.nestjs.com/custom-decorators#param-decorators)
 */
export const UserFromJwt = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
