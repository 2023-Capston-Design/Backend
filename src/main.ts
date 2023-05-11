import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const documentConfig = new DocumentBuilder()
    .setTitle('API Document : Cloud education environment')
    .setDescription('REST API of cloud education environment')
    .setVersion('1.0')
    .setContact(
      'hoplin',
      'https://github.com/J-hoplin1',
      'jhoplin7259@gmail.com',
    )
    .addTag('Health Checker')
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
