import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { IServiceHealth } from './common/interfaces/serviceHealth.interface';
import { ServiceStatusEnum } from './common/enums/appStatus.enum';
import { KafkaService } from './kafka/kafka.service';
import { DatabaseService } from './database/database.service';
import appConfig from './app.config';

@Injectable()
export class AppService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly kafkaService: KafkaService,
    @Inject(appConfig.KEY)
    private config: ConfigType<typeof appConfig>,
  ) {}

  async getServiceHealth(
    _deep: 'one' | 'all' | 'none' = 'none',
  ): Promise<IServiceHealth> {
    console.log("CALLED BABY", _deep);
    const healthStatus: IServiceHealth = {
      serviceName: this.config.appName,
      serviceVersion: this.config.appVersion,
      status: ServiceStatusEnum.OK,
      statusMessage: 'Service is up.',
      connectedServices: [],
    };
    if (_deep === 'none') return healthStatus;
    // const _deepForConnected = _deep === 'one' ? 'none' : 'one';
    healthStatus.connectedServices = (
      await Promise.allSettled([
        this.kafkaService.getServiceHealth(),
        this.dbService.getServiceHealth(),
      ])
    )
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result as PromiseFulfilledResult<any>).value);
    return healthStatus;
  }
}
