import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class TransactionTypeDTO {
  @Field()
  name: string;
}

@ObjectType()
export class TransactionStatusDTO {
  @Field()
  name: string;
}

@ObjectType()
export class TransactionDTO {
  @Field()
  id: string;

  @Field()
  transactionExternalId?: string;

  @Field(() => TransactionTypeDTO)
  transactionType: TransactionTypeDTO;

  @Field(() => TransactionStatusDTO)
  transactionStatus: TransactionStatusDTO;

  @Field(() => Float)
  value: number;

  @Field()
  createdAt: Date;
}
