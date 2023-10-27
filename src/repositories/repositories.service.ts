import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IRepository } from '../shared/interfaces';
import { GithubProvider } from '../scanner/providers/github.provider';
import { ProviderEnum } from '../shared/enums';
import { Provider } from '../scanner/providers/provider';

@Injectable()
export class RepositoriesService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly githubProvider: GithubProvider) {
    this.providersMap = new Map();
    this.providersMap.set(ProviderEnum.GITHUB, githubProvider);
  }

  private providersMap: Map<ProviderEnum, Provider<any>>;

  async getRepositoriesByProvider(provider: string): Promise<IRepository[]> {
    // TODO: Handle errors? what if cache is empty? provider not exist?
    return this.cacheManager.get(provider);
  }

  async getRepositoryDetailsByName(providerName: ProviderEnum, name: string): Promise<IRepository> {
    const repository = await this.cacheManager.get(`${providerName}_${name}`);
    if (repository) {
      return repository as IRepository;
    }

    return this.providersMap.get(providerName).getRepositoryByName(name);
  }
}
