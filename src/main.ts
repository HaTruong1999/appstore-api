import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('APP STORE APIs')
    .setDescription('The App Store API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Kiểm tra đầu vào(pipes)
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const PORT = process.env.PORT || 3001
  await app.listen(PORT);
}
bootstrap();
