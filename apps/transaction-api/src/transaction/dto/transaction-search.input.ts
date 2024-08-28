import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class TransactionSearchInput {
  @Field({ nullable: true })
  accountExternalIdDebit?: string;

  @Field({ nullable: true })
  accountExternalIdCredit?: string;
}
