import { OmitType, PartialType } from "@nestjs/swagger";
import { DcaAccountEntity } from "../entities/dca-order-account.entity";

export class UpdateDcaAccountDto extends PartialType(
  OmitType(DcaAccountEntity, ["accountId", "createdAt", "updatedAt"]),
) {}
