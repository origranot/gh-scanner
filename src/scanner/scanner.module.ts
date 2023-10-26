import { Module } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import { AppConfigModule } from '../config/config.module';
import { GithubProvider } from './providers/github.provider';

@Module({
  imports: [AppConfigModule],
  providers: [ScannerService, GithubProvider],
  exports: [GithubProvider],
})
export class ScannerModule {}
