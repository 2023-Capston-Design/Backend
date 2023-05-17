import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerTags } from './swagger.tags';
import { INestApplication } from '@nestjs/common';

const documentConfig = new DocumentBuilder()
  .setTitle('API Document : Cloud education environment')
  .setDescription('Cloud education environment API document')
  .setVersion('1.0')
  .setContact(
    'hoplin',
    'https://github.com/J-hoplin1',
    'jhoplin7259@gmail.com',
  );

swaggerTags.forEach((tag: SwaggerTag) =>
  documentConfig.addTag(tag.tag, tag.description),
);

export default function generateSwaggerDocument(app: INestApplication) {
  return SwaggerModule.createDocument(app, documentConfig.build());
}
