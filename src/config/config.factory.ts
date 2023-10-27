import { ConfigFactory } from '@nestjs/config';

export const configFactory: ConfigFactory<{ config: IConfig }> = () => {
  return {
    config: {
      port: parseInt(process.env.PORT, 10) || 3000,
      scannerInterval: parseInt(process.env.SCANNER_INTERVAL, 10) || 60000,
      scannerBatchSize: parseInt(process.env.SCANNER_BATCH_SIZE, 10) || 2,
      githubToken: process.env.GITHUB_TOKEN,
      usernameToScan: process.env.GITHUB_USERNAME_TO_SCAN,
      filePath: process.env.FILE_PATH,
    },
  };
};

export interface IConfig {
  port: number;
  scannerInterval: number; // in milliseconds
  githubToken: string;
  usernameToScan: string;
  filePath: string;
  scannerBatchSize: number;
}
