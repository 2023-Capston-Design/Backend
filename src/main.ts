import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
