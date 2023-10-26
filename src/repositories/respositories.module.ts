import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { RespositoriesResolver } from './respositories.resolver';
import { RepositoriesService } from './repositories.service';
import { ScannerModule } from '../scanner/scanner.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    ScannerModule,
  ],
  providers: [RespositoriesResolver, RepositoriesService],
})
export class RespositoriesModule {}
