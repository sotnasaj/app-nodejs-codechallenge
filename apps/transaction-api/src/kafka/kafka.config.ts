import { registerAs } from '@nestjs/config';
import { IKafkaConfig } from './interfaces/kafkaConfig';
import { stringToArray } from '../common/helpers/stringHelper';

export default registerAs(
  'kafka',
  (): IKafkaConfig => ({
    brokers: stringToArray(process.env.KAFKA_BROKERS || 'kafka:29092'),
    healthStrategy: process.env.KAFKA_HEALTH_STRATEGY || 'DEFAULT',
    hearthBeatInterval: parseInt(process.env.HEARTH_BEAT_INTERVAL_MS) || 30000,
    groupId: 'transactions_group',
    clientId: 'transaction_service',
    transactionTopic: 'topic_transaction'
  }),
);
