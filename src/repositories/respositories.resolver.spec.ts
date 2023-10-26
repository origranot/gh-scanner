import { Test, TestingModule } from '@nestjs/testing';
import { RespositoriesResolver } from './respositories.resolver';

describe('RespositoriesResolver', () => {
  let resolver: RespositoriesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RespositoriesResolver],
    }).compile();

    resolver = module.get<RespositoriesResolver>(RespositoriesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
