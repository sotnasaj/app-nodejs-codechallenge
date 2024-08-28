import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Consumer, Kafka, Producer, Admin } from 'kafkajs';
import kafkaConfig from './kafka.config';
import { ServiceStatusEnum } from '../common/enums/appStatus.enum';
import { IServiceHealth } from '../common/interfaces/serviceHealth.interface';

@Injectable()
export class KafkaService {
  private readonly client: Kafka;
  private readonly producer: Producer// kafka.producer();
  private readonly consumer: Consumer //kafka.consumer({ groupId: 'my-group' });
  private readonly admin: Admin;
  private status: ServiceStatusEnum = ServiceStatusEnum.DOWN;

  constructor(
    @Inject(kafkaConfig.KEY)
    private config: ConfigType<typeof kafkaConfig>,
  ) {
    this.client = new Kafka({
      brokers: config.brokers,
      clientId: config.clientId,
      requestTimeout: 2000,
      authenticationTimeout: 2000,
    });
    this.admin = this.client.admin();
    this.producer = this.client.producer();
    this.consumer = this.client.consumer({ groupId: config.groupId });
  }

  private async checkHealth(): Promise<ServiceStatusEnum> {
    try {
      await this.admin.listTopics();
      return ServiceStatusEnum.OK;
    } catch (err) {
      console.log("KAFKA ERROR", err)
      return ServiceStatusEnum.DOWN;
    }
  }

  /**
   * Apply connection once all consumer are already registered
   */
  async onApplicationBootstrap() {
    // Finalize connection after module initialization
    await Promise.all([
      await this.admin.connect(),
      await this.producer.connect(),
      await this.consumer.connect(),
    ]);
    console.info(`KAFKA SERVICE CONNECTED`);
    // Health could be either by request or by heartbeat
    if (this.config.healthStrategy === 'HEARTBEAT') {
      this.startHeartbeat();
    }
  }

  /**
   * To reduce overhead a timer can be set t through for health checks
   */
  private async startHeartbeat() {
    console.info(`KAFKA SERVICE HEARTBEAT STARTED`);
    setInterval(async () => {
      this.status = await this.checkHealth();
    }, this.config.hearthBeatInterval);
  }


  // Tech debt: improve status message with appropriate details
  async getServiceHealth(): Promise<IServiceHealth> {
    const health: IServiceHealth = {
      serviceName: 'Kafka',
      serviceVersion: '1',
      status: this.status,
      statusMessage: 'Service is up.', 
      connectedServices: [],
    }
    if (this.config.healthStrategy === 'HEARTBEAT') {
      health.status = this.status;
    } else {
      health.status = await this.checkHealth();
    }
    health.statusMessage = health.status === ServiceStatusEnum.OK
      ? 'Service is up.'
      : 'Service is down.';
    return health;
  }

  async sendMessage(topic: string, message: Record<string, any>) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async subscribeToTopics(topic: string, consumerFunction: (message: any) => void) {
    await this.consumer.subscribe({ topic });
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        console.log(`Received message from topic ${topic}: ${message.value.toString()}`);
        consumerFunction(message);
      },
    });
  }
  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    await this.admin.disconnect();
  }
}
