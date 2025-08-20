import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setup(app) {
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}