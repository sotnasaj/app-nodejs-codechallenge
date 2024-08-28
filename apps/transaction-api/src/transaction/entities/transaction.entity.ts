import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TransactionTypeEnum, TransactionStatusEnum } from '../enums';
import { BaseEntity } from '../../common/entities/baseEntity';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @Column({
    type: 'enum',
    enum: TransactionTypeEnum,
  })
  transferTypeId: TransactionTypeEnum;

  @Column('float')
  value: number;

  @Column({
    nullable: true
  })
  transactionStatusReason?: string;

  @Column({
    nullable: true
  })
  transactionExternalId?: string;

  @Column({
    type: 'enum',
    enum: TransactionStatusEnum,
    default: TransactionStatusEnum.PENDING,
  })
  transactionStatus: TransactionStatusEnum;
}
