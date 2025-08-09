import { PartialType } from "@nestjs/swagger";
import { CreateAccountDto } from "./create-account.dto";

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  balance?: number;
  tokenBalance?: number;
  isBalanceSynced?: boolean;
  isTokenBalanceSynced?: boolean;
  tokenAccountId?: string;
  isTokenAccountInitialized?: boolean;
  syncedAt?: Date;
  lastBuyAt?: Date;
  lastSellAt?: Date;
  exportedAt?: Date;
}
