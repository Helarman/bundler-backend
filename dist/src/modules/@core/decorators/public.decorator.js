"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Public = exports.IS_PUBLIC_KEY = void 0;
const local_auth_guard_1 = require("../guards/local-auth.guard");
const common_1 = require("@nestjs/common");
exports.IS_PUBLIC_KEY = "isPublic";
const Public = () => (0, common_1.applyDecorators)((0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true), (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard));
exports.Public = Public;
