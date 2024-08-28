import { v4 as uuidV4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { TransactionEventDTO } from './dto/transaction-create-event.dto';
import { TransactionStatusEnum } from './enums/transactionStatus.enum';
import { TransactionUpdateEventDTO } from './dto/transaction-update-event.dto';
import { catchError } from 'rxjs';

@Injectable()
export class AppService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'hero-client',
        brokers: ['kafka:29092'],
      }
    },
  })
  client: ClientKafka;

  async validateTransactionCreation(event: TransactionEventDTO): Promise<void> {
    console.info(`Processing event ${event.id}`);
    let resolutionStatus = TransactionStatusEnum.COMPLETED;
    let resolutionStatusMessage = 'Approved';
    if (event.value > 100) {
      resolutionStatus = TransactionStatusEnum.FAILED;
      resolutionStatusMessage = 'Amount exceeded'
    }
    this.client.emit(
      'transaction_fraud_resolution',
      {
        value: {
          id: event.id,
          transactionStatus: resolutionStatus,
          reason: resolutionStatusMessage,
          externalTransactionId: uuidV4(),
        } as TransactionUpdateEventDTO
      }).pipe(
        catchError((err) => {
          // tech debt: ADD A FALLBACK NOTIFICATION / QUEUE MECHANISM ON EVENT ERROR HERE OR GLOBALLY
          console.log("ERROR CREATING TRANSACTION EVENT", err);
          return undefined;
        })
      )
  }
}
