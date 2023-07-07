import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { OrdersModule } from './orders/orders.module';
import { TransformInterceptor } from './utils/transform.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
                connectionFactory: (connection) => {
                    connection.plugin(softDeletePlugin);
                    return connection;
                },
            }),
            inject: [ConfigService],
        }),

        ConfigModule.forRoot({
            isGlobal: true,
        }),

        UsersModule,

        AuthModule,

        OrdersModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
})
export class AppModule {}
