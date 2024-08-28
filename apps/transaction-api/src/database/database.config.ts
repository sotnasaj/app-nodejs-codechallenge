import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions & { hearthBeatInterval: number, healthStrategy: string } => ({
    type: process.env.DB_TYPE || ('postgres' as any),
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'yape',
    entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
    dropSchema: process.env.DB_DROP_SCHEMA === 'true',
    synchronize: true,
    hearthBeatInterval:
      parseInt(process.env.DB_HEARTH_BEAT_INTERVAL_MS) || 10000,
    healthStrategy: process.env.DB_HEALTH_STRATEGY || "DEFAULT",
  }),
);
