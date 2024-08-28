export interface IKafkaConfig {
  brokers: string[];
  hearthBeatInterval: number;
  healthStrategy: string;
  clientId: string,
  groupId: string,
  transactionTopic: string
}
