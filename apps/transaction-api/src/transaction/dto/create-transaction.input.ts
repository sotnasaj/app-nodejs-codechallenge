import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsEnum, IsUUID, IsPositive } from 'class-validator';
import { TransactionTypeEnum } from '../enums';

@InputType()
export class CreateTransactionInput {
  @Field()
  @IsUUID()
  accountExternalIdDebit: string;

  @Field()
  @IsUUID()
  accountExternalIdCredit: string;

  @Field(() => Int)
  @IsEnum(TransactionTypeEnum)
  transferTypeId: TransactionTypeEnum;

  @Field(() => Float)
  @IsPositive()
  value: number;
}
