import { Controller } from "../@core/decorators/controller.decorator";
import { AccountsService } from "../accounts/services/accounts.service";
import { SolanaService } from "./services/solana.service";

@Controller("solana")
export class SolanaController {
  constructor(
    private service: SolanaService,
    private accountsService: AccountsService,
  ) {}
}
