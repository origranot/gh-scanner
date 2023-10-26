import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfig } from './config.factory';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  getConfig(): IConfig {
    const config = this.configService.get<IConfig>('config');
    if (!config) {
      throw new ConfigNotFoundError();
    }
    return config;
  }
}

export class ConfigNotFoundError extends Error {
  constructor() {
    super('Configuration not found');
  }
}
