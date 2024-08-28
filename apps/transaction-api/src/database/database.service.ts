import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { DataSource } from 'typeorm';
import dbConfig from './database.config';
import { IServiceHealth } from '../common/interfaces/serviceHealth.interface';
import { ServiceStatusEnum } from '../common/enums/appStatus.enum';

@Injectable()
export class DatabaseService {
  private status: ServiceStatusEnum;
  private statusMessage: string;

  constructor(
    @Inject(dbConfig.KEY)
    private config: ConfigType<typeof dbConfig>,
    private dataSource: DataSource,
  ) {
    if (this.config.healthStrategy === 'HEARTBEAT') {
      this.startHeartbeat();
    }
  }

  private async checkHealth(): Promise<[ServiceStatusEnum, string]> {
    try {
      await this.dataSource.query('SELECT 1');
      return [ServiceStatusEnum.OK, "Service is Up."];
    } catch (error) {
      return [ServiceStatusEnum.DOWN, `Service is down. ${error.message}`]
    }
  }

  private async startHeartbeat() {
    setInterval(async () => {
      const [status, message] = await this.checkHealth();
      this.status = status;
      this.statusMessage = message;

    }, this.config.hearthBeatInterval);
  }

  async getServiceHealth(): Promise<IServiceHealth> {
    const health: IServiceHealth = {
      serviceName: 'Kafka',
      serviceVersion: '1',
      status: ServiceStatusEnum.OK,
      statusMessage: 'Service is up.', 
      connectedServices: [],
    }
    if (this.config.healthStrategy === 'HEARTBEAT') {
      health.status = this.status;
      health.statusMessage = this.statusMessage;
    } else {
      const [status, message] = await this.checkHealth();
      health.status = status;
      health.statusMessage = message;
    }
    return health;
  }
}
