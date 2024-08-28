import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionDTO } from './dto/transaction.dto';
import { mapTransactionEntityToDTO } from './mappers/transaction.mapper';

@Resolver()
export class TransactionResolver {
  constructor(
    private readonly transactionService: TransactionService,
  ) {}

  @Mutation(() => TransactionDTO)
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ): Promise<TransactionDTO> {
    const transaction = await this.transactionService.createTransaction(createTransactionInput);
    return mapTransactionEntityToDTO(transaction);

  }

  @Query(() => TransactionDTO)
  async getTransaction(
    @Args('id') id: string,
  ): Promise<TransactionDTO> {
    const transaction = await this.transactionService.findTransactionById(id);
    return mapTransactionEntityToDTO(transaction);
  }
}
