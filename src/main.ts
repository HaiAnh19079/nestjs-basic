import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './utils/transform.interceptor';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const configService = app.get(ConfigService);

    //config JwtAuthGuard globally
    const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));

    app.useGlobalPipes(new ValidationPipe());

    // app.useGlobalInterceptors(new TransformInterceptor());

    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        preflightContinue: false,
        credentials: true,
    });

    await app.listen(configService.get<string>('PORT'));
}
bootstrap();
