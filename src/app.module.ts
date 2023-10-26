import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { ScannerModule } from './scanner/scanner.module';
import { RepositoriesService } from './repositories/repositories.service';
import { RespositoriesModule } from './repositories/respositories.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    AppConfigModule,
    CacheModule.register({ isGlobal: true }),
    ScannerModule,
    RespositoriesModule,
  ],
  providers: [RepositoriesService],
})
export class AppModule {}
