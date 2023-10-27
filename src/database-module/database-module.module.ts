import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from './service/sequlize-config.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({ useClass: SequelizeConfigService }),
  ],
})
export class DatabaseModule {
  constructor() {}
}
