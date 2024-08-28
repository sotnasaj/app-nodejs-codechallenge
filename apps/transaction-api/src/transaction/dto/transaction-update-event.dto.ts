import { TransactionStatusEnum } from "../enums";

export class TransactionUpdateEventDTO {
  id: string;
  transactionStatus: TransactionStatusEnum;
  reason?: string;
  externalTransactionId: string;
}