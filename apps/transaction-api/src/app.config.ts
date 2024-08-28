import { registerAs } from '@nestjs/config';
import { AppConfig } from './interfaces/appConfig';

export default registerAs(
  'app',
  (): AppConfig => ({
    appVersion: process.env.npm_package_version?.toString() || 'N/A',
    appName: process.env.npm_package_version?.toString() || 'transaction-api',
    globalPrefix: 'yape/api',
    port: parseInt(process.env.APP_PORT, 10) | 3001,
    jwtSecret: process.env.JWT_SECRET_KEY,
    jwtExpires: parseInt(process.env.JWT_EXPIRES, 10) | 3600,
  }),
);
