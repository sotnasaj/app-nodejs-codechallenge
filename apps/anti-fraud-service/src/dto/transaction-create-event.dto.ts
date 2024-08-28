import { IsIn, IsPositive, IsUUID } from "class-validator";
import { TransactionStatusEnum } from "../enums/transactionStatus.enum";

export class TransactionEventDTO {
  @IsUUID('4', { message: 'Invalid transaction id event'})
  id: string;

  @IsPositive({ message: 'Transaction value amount should be positive, use transaction type to define credit/debit/(rewards?) or the allowed transactions' })
  value: number;

  @IsIn([TransactionStatusEnum.PENDING], { message: 'Only Pending transaction events are allowed to be processed' })
  transactionStatus: TransactionStatusEnum.PENDING;
}