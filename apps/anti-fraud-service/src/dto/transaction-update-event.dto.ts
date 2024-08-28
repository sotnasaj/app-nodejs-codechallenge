import { TransactionStatusEnum } from "../enums/transactionStatus.enum";

export class TransactionUpdateEventDTO {
  id: string;
  transactionStatus: TransactionStatusEnum;
  reason?: string;
  externalTransactionId: string;
}