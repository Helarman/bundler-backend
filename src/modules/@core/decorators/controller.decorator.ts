import { Controller as NestController } from "@nestjs/common";
import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

export interface IControllerDecoratorOptions {
  tags?: string[];
}

export const Controller = (
  path: string,
  options?: IControllerDecoratorOptions,
) => {
  return applyDecorators(
    NestController(path),
    ApiTags(...(options?.tags ?? [path])),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: "Unauthorized access",
    }),
  );
};
