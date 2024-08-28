import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { Transaction } from './entities/transaction.entity';
import { KafkaModule } from '../kafka/kafka.module';
import { KafkaService } from '../kafka/kafka.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), KafkaModule],
  providers: [TransactionResolver, TransactionService],
  exports: [TransactionService],
})
export class TransactionModule implements OnModuleInit {
  constructor(private readonly kafkaService: KafkaService, private readonly transactionService: TransactionService) {}

  async onModuleInit() {
    await this.kafkaService.subscribeToTopics(
      'transaction_fraud_resolution',
      async (message) => {
        const parsedMessage = JSON.parse(message.value.toString());
        await this.transactionService.updateTransactionStatus(
          parsedMessage.id,
          parsedMessage.transactionStatus,
          parsedMessage.externalTransactionId,
          parsedMessage.reason,
        );
      }
    );
  }
}