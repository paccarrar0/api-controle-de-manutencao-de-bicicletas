import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { HttpExceptionFilter } from './shared/http-exception.filter';

async function bootstrap() {
  const appOptions = {cors: true};
  const app = await NestFactory.create(ApplicationModule, appOptions);
  app.setGlobalPrefix('api');

  app.setGlobalPrefix('v1/api');

  const options = new DocumentBuilder()
    .setTitle('API Controle de Bicicletas')
    .setDescription('API para gerenciamento de manutenção de bicicletas')
    .setVersion('1.0')
    //.setBasePath('v1/api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();