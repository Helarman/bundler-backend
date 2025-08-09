export class SolanaTxCreatedEvent {
  static readonly id = "solana-tx-created";

  constructor(
    public params: {
      txHash: string;
      signerIds?: string[];
    },
  ) {}
}

export class SolanaTxSuccessEvent {
  static readonly id = "solana-tx-success";

  constructor(
    public params: {
      txHash: string;
      signerIds?: string[];
    },
  ) {}
}

export class SolanaTxFailedEvent {
  static readonly id = "solana-tx-failed";

  constructor(
    public params: {
      txHash: string;
      signerIds?: string[];
    },
  ) {}
}

export class SolanaUnhandledTxsEvent {
  static readonly id = "solana-txs-unhandled";

  constructor(
    public params: {
      txHashes: string[];
    },
  ) {}
}

export class SolanaSynchronizeAccountsEvent {
  static readonly id = "solana-synchronize-accounts";

  constructor(public type?: "unsynced" | "all") {}
}
