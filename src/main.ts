import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseHandlerInterceptor } from './interceptors/response.handler.interceptor';
import { CustomExceptionFilter } from './exceptions/error.handler';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in DTO
      forbidNonWhitelisted: true, // throws error if extra props
      transform: true, // auto-transforms payloads to DTO classes
    }),
  );
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  app.useGlobalInterceptors(new ResponseHandlerInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
