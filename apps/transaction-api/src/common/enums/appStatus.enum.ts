export enum ServiceStatusEnum {
  OK = 'OK',
  WARN = 'WARN',
  DOWN = 'DOWN',
}

export const ServiceStatusEnumDescription: Record<ServiceStatusEnum, string> = {
  [ServiceStatusEnum.OK]: 'Service is up and running',
  [ServiceStatusEnum.WARN]:
    'Service is up and running, but some connected services reported as down. Please check conneccted Services section for further details',
  [ServiceStatusEnum.DOWN]: 'Service is not available',
};
