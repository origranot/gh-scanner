import { Resolver, Query, Args } from '@nestjs/graphql';
import { RepositoriesService } from './repositories.service';
import { DetailedRepository, Repository } from '../models/repository.model';
import { ProviderEnum } from '../shared/enums';

@Resolver()
export class RespositoriesResolver {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Query(() => [Repository])
  async repositoriesByProvider(@Args('provider', { type: () => ProviderEnum }) provider: ProviderEnum) {
    return this.repositoriesService.getRepositoriesByProvider(provider);
  }

  @Query(() => DetailedRepository)
  async repositoryByName(@Args('provider', { type: () => ProviderEnum }) provider: ProviderEnum, @Args('name') name: string) {
    return this.repositoriesService.getRepositoryDetailsByName(provider, name);
  }
}
