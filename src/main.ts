import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseHandlerInterceptor } from './interceptors/response.handler.interceptor';
import { CustomExceptionFilter } from './exceptions/error.handler';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log('bootstrap start'); // diagnostic: did we get this far?

  const app = await NestFactory.create(AppModule);

  console.log('app created'); // diagnostic

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Allow overriding origin in Render env; fallback to localhost during dev
  const origin = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
  app.enableCors({
    origin: '*', // allow any origin
    credentials: false, // cannot use credentials with wildcard origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
    optionsSuccessStatus: 204,
  });

  app.useGlobalInterceptors(new ResponseHandlerInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());
  // IMPORTANT: bind to 0.0.0.0 and read Render's provided PORT env var
  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`Listening on port ${port} (bound to 0.0.0.0)`);
}

bootstrap().catch((err) => {
  console.error('bootstrap failed', err);
  process.exit(1);
});
