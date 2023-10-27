import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { DatabaseModule } from './database-module/database-module.module';
import { AuthModule } from './modules/auth/auth.module';
import { ERROR_LOGS_LOCATION, INFO_LOGS_LOCATION } from './shared/utils';
import { UserModule } from './modules/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './modules/auth/constants';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { TenantProviderMiddleware } from './tenant-provider/middlewares/tenant-provider.middleware';
import { TenantModule } from './modules/tenant/tenant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: jwtConstants.getSecret(),
      signOptions: { expiresIn: '6000s' },
      global: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    WinstonModule.forRoot({
      level: 'verbose',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
      defaultMeta: { service: 'app-module' },
      transports: [
        new winston.transports.File({
          filename: ERROR_LOGS_LOCATION(),
          level: 'error',
        }),
        new winston.transports.File({ filename: INFO_LOGS_LOCATION() }),
      ],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    TenantModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: 'JwtService',
      useClass: JwtService,
    },
    TenantProviderMiddleware,
  ],
})
export class AppModule {
  configure(app: MiddlewareConsumer) {
    app.apply(TenantProviderMiddleware).forRoutes('*');
  }
}
