import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './utils/transform.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const configService = app.get(ConfigService);

    //config JwtAuthGuard globally
    const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));

    //config validator
    app.useGlobalPipes(new ValidationPipe());

    //config interceptor
    app.useGlobalInterceptors(new TransformInterceptor(reflector));

    //config versioning
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: ['1', '2'],
    });

    //config cors
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        preflightContinue: false,
        credentials: true,
    });

    //config cookie
    app.use(cookieParser());

    await app.listen(configService.get<string>('PORT'));
}
bootstrap();
