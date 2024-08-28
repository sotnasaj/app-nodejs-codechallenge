export interface AppConfig {
  appVersion: string;
  appName: string;
  globalPrefix: string;
  port: number;
  jwtSecret: string;
  jwtExpires: number;
}
