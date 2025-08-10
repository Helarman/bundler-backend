"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const Controller = (path, options) => {
    return (0, common_2.applyDecorators)((0, common_1.Controller)(path), (0, swagger_1.ApiTags)(...(options?.tags ?? [path])), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Unauthorized access",
    }));
};
exports.Controller = Controller;
