import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = app.get(AppConfigService).getConfig().port;
  await app.listen(port);
}
bootstrap();
