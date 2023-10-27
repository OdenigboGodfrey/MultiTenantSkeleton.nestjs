import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ERROR_LOGS_LOCATION, INFO_LOGS_LOCATION } from './../../shared/utils';
import { UserService } from '../user/services/user.service';
import { UserRepository } from '../user/repository/user.repository';
import { SequelizeConfigService } from 'src/database-module/service/sequlize-config.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: jwtConstants.getSecret(),
      signOptions: { expiresIn: '6000s' },
    }),
    WinstonModule.forRoot({
      level: 'verbose',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
      defaultMeta: { service: 'auth-module' },
      transports: [
        new winston.transports.File({
          filename: ERROR_LOGS_LOCATION(),
          level: 'error',
        }),
        new winston.transports.File({ filename: INFO_LOGS_LOCATION() }),
      ],
    }),
    // CacheModule.register(),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'JwtService',
      useClass: JwtService,
    },
    {
      provide: 'UserService',
      useClass: UserService,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'SequelizeConfigService',
      useClass: SequelizeConfigService,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
