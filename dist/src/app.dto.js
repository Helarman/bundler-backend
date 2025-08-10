"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAppDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const app_entity_1 = require("./app.entity");
class UpdateAppDto extends (0, swagger_1.PartialType)((0, swagger_1.PickType)(app_entity_1.AppEntity, [
    "tokenId",
    "bondingCurveId",
    "associatedBondingCurveId",
    "balanceUsagePercent",
    "priorityMicroLamptorsFee",
])) {
}
exports.UpdateAppDto = UpdateAppDto;
