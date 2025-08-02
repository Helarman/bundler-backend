export class SendTransactionsDto {
  transactions: string[];
  useRpc?: boolean;
}

export class TransactionStatusDto {
  success: boolean;
  signature: string;
  status: string;
  confirmations: number;
  blockTime: number;
  slot: number;
}

export class TransactionResultDto {
  signature: string;
  status: string;
}

export class SendTransactionsResponseDto {
  success: boolean;
  result: {
    results: TransactionResultDto[];
    bundleId: string;
  };
  message: string;
}