import { TransactionDTO } from '../dto/transaction.dto';
import { Transaction } from '../entities/transaction.entity';
import { TransactionStatusEnum, TransactionTypeEnum } from '../enums';

export const mapTransactionEntityToDTO = (
  transaction: Transaction,
): TransactionDTO => {
  return {
    id: transaction.id,
    transactionExternalId: transaction.transactionExternalId,
    transactionType: { name: TransactionTypeEnum[transaction.transferTypeId] },
    transactionStatus: {
      name: TransactionStatusEnum[transaction.transactionStatus],
    },
    value: transaction.value,
    createdAt: transaction.createdAt,
  };
};
