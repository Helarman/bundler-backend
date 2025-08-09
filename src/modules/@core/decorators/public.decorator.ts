import { LocalAuthGuard } from "../guards/local-auth.guard";
import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () =>
  applyDecorators(SetMetadata(IS_PUBLIC_KEY, true), UseGuards(LocalAuthGuard));
