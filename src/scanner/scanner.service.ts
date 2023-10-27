import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AppConfigService } from '../config/config.service';
import { GithubProvider } from './providers/github.provider';
import { Provider } from './providers/provider';
import { IRepository } from '../shared/interfaces';

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

    const { usernameToScan, scannerBatchSize } = this.config.getConfig();

    for (const provider of this.providers) {
      console.log(`Scanning ${provider.name} repositories...`);
      const repositories = await provider.getRepositoriesNamesByUsername(usernameToScan);
      await this.scanRepositoriesInBatches(provider, repositories, scannerBatchSize);
      console.log(`Finished scanning ${provider.name} repositories, found ${repositories.length} repositories`);
    }

    console.log('Finished scanning repositories');
  };

  private async scanRepositoriesInBatches(provider: Provider<any>, repositories: Partial<IRepository>[], batchSize: number) {
    const detailedRepositories: IRepository[] = [];

    for (let i = 0; i < repositories.length; i += batchSize) {
      const batch = repositories.slice(i, i + batchSize); // Get the next batch of repositories

      const promises = batch.map(async (repository) => {
        const repositoryDetails = await provider.getRepositoryByName(repository.name);
        return repositoryDetails;
      });

      // Wait for all promises to be resolved
      const batchResults = await Promise.all(promises);

      // Save the details of each repository in the cache
      for (const result of batchResults) {
        await this.cacheManager.set(`${provider.name}_${result.name}`, result, 0);
        detailedRepositories.push(result);
      }
    }

    // Save all the repositories in the cache
    await this.cacheManager.set(provider.name, detailedRepositories, 0);
  }
}
