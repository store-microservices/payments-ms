import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { env } from './config/env';

async function bootstrap() {
  const logger = new Logger('Payments-Microservice');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(env.PORT, () =>
    logger.log('Payments Microservice is running on port ' + env.PORT),
  );
}
bootstrap();
