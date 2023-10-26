import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AppConfigService } from '../config/config.service';
import { GithubProvider } from './providers/github.provider';
import { Provider } from './providers/provider';

export const REPOSITORIES_CACHE_KEY = 'REPOSITORIES_CACHE_KEY';

@Injectable()
export class ScannerService implements OnModuleInit {
  constructor(
    private readonly config: AppConfigService,
    private readonly githubProvider: GithubProvider,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.providers = [githubProvider];
  }

  private providers: Provider<any>[];

  async onModuleInit() {
    // Runs on application start
    await this.scan();
    setInterval(this.scan, this.config.getConfig().scannerInterval);
  }

  scan = async () => {
    console.log('Scanning repositories...');

    const usernameToScan = this.config.getConfig().usernameToScan;

    for (const provider of this.providers) {
      console.log(`Scanning ${provider.name} repositories...`);
      const repositories = await provider.getRepositoriesByUsername(usernameToScan);
      this.cacheManager.set(provider.name, repositories, 0);
      console.log(`Finished scanning ${provider.name} repositories, found ${repositories.length} repositories`);
    }

    console.log('Finished scanning repositories');
  };
}
