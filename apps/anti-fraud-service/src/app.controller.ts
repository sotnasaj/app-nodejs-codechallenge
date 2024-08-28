import { Controller, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { TransactionEventDTO } from './dto/transaction-create-event.dto';


@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @MessagePattern('transaction-topic')
  async processTransaction(
    @Payload(new ValidationPipe({ transform: true })) message: { value: TransactionEventDTO },
  ): Promise<void> {
    console.log("message", message);
    await this.service.validateTransactionCreation(message.value);
  }
}