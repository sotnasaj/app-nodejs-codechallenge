import { TransactionStatusEnum } from "../enums";

export class TransactionEventDTO {
  id: string;
  value: number;
  transactionStatus: TransactionStatusEnum;
}