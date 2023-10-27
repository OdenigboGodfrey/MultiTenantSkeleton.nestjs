import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ERROR_LOGS_LOCATION, INFO_LOGS_LOCATION } from './../../shared/utils';
import { UserRepository } from './repository/user.repository';
import { SequelizeConfigService } from 'src/database-module/service/sequlize-config.service';

@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'verbose',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
      defaultMeta: { service: 'user-module' },
      transports: [
        new winston.transports.File({
          filename: ERROR_LOGS_LOCATION(),
          level: 'error',
        }),
        new winston.transports.File({ filename: INFO_LOGS_LOCATION() }),
      ],
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'SequelizeConfigService',
      useClass: SequelizeConfigService,
    },
  ],
})
export class UserModule {}
