"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const account_entity_1 = require("../entities/account.entity");
class CreateAccountDto extends (0, swagger_1.PickType)(account_entity_1.AccountEntity, [
    "name",
    "color",
]) {
}
exports.CreateAccountDto = CreateAccountDto;
