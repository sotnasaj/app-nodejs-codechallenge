import { ServiceStatusEnum } from '../enums/appStatus.enum';
export interface IServiceHealth {
  serviceName: string;
  serviceVersion: string;
  status: ServiceStatusEnum;
  statusMessage: string;
  connectedServices?: IServiceHealth[];
}
