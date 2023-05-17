import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import generateSwaggerDocument from './infrastructure/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true, credentials: true });
  app.use(helmet());
  /**
   * Define global pipe
   *
   * - Validation pipe with class transformer enable
   *
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  SwaggerModule.setup('docs', app, generateSwaggerDocument(app));
  await app.listen(3000);
}
bootstrap();
