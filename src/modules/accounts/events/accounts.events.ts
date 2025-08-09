import { AccountEntity } from "../entities/account.entity";

export class AccountCreatedEvent {
  static readonly id = "account-created";

  constructor(public account: AccountEntity) {}
}
