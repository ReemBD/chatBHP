import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // TODO: Enable CORS for the client only
  app.enableCors({
    origin: '*',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Server is running on port ${port}`);
}

bootstrap();
