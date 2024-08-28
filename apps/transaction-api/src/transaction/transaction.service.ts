import { catchError } from 'rxjs';
import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { Transaction } from './entities/transaction.entity';
import { TransactionStatusEnum } from './enums';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class TransactionService {
  private readonly transactionTopic = 'transaction-topic';

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly kafkaService: KafkaService
  ) { }

  async findTransactionById(id: string): Promise<Transaction> {
    return this.transactionRepository.findOneBy({ id });
  }

  async createTransaction(
    createTransactionInput: CreateTransactionInput,
  ): Promise<Transaction> {
    const createdTransaction = await this.transactionRepository.save(createTransactionInput);
    // tech debt: wrapper function for transaction event creation
    this.kafkaService.sendMessage(this.transactionTopic, {
      value: {
        id: createdTransaction.id,
        value: createdTransaction.value,
        transactionStatus: createdTransaction.transactionStatus,
      }
    }).catch((err) => {
      console.error(`Error while creating kafka event. fallback pattern not implemented yer.`, err);
    })
    return createdTransaction;
  }

  async updateTransactionStatus(id: string, status: TransactionStatusEnum, externalTransactionId: string, reason = "Unknown reason") {
    return this.transactionRepository.update(
      id,
      {
        transactionStatus: status,
        transactionExternalId: externalTransactionId,
        transactionStatusReason: reason,
      });
  }
}
