import { PartialType, PickType } from "@nestjs/swagger";
import { App } from "@prisma/client";
import { AppEntity } from "./app.entity";

export interface IUpdateAppDto
  extends Partial<
    Pick<
      App,
      | "tokenId"
      | "bondingCurveId"
      | "associatedBondingCurveId"
      | "balanceUsagePercent"
      | "priorityMicroLamptorsFee"
    >
  > {}

export class UpdateAppDto extends PartialType(
  PickType(AppEntity, [
    "tokenId",
    "bondingCurveId",
    "associatedBondingCurveId",
    "balanceUsagePercent",
    "priorityMicroLamptorsFee",
  ]),
) {}
