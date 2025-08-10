"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDcaAccountDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const dca_order_account_entity_1 = require("../entities/dca-order-account.entity");
class UpdateDcaAccountDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(dca_order_account_entity_1.DcaAccountEntity, ["accountId", "createdAt", "updatedAt"])) {
}
exports.UpdateDcaAccountDto = UpdateDcaAccountDto;
