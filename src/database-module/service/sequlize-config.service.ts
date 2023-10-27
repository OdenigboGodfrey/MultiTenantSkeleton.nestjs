import { Injectable } from '@nestjs/common';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import { SequelizeOptions } from 'sequelize-typescript';
import { sequelizeConfig } from 'src/sequelize.config';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor() {
    this.sequelizeConfiguration = sequelizeConfig;
  }
  //   createSequelizeOptions(connectionName?: string): SequelizeModuleOptions | Promise<SequelizeModuleOptions> {
  //       throw new Error('Method not implemented.');
  //   }

  createSequelizeOptions(): SequelizeModuleOptions {
    // Get the configuration from your service or any other source
    // const aa: SequelizeModuleOptions = {
    // };
    // const sequelizeConfig: SequelizeOptions = {
    //   dialect: 'mysql', // Update with your database dialect
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'your_username',
    //   password: 'your_password',
    //   database: 'your_database',
    // };

    // return connection as SequelizeOptions;
    // sequelizeConfig.schema = 'notpublic';
    console.log('createSequelizeOptions');
    return this.sequelizeConfiguration;

    // return sequelizeConfig;
  }

  private sequelizeConfiguration: SequelizeOptions;

  getSequelizeConfig(): SequelizeOptions {
    return this.sequelizeConfiguration;
  }

  setSequelizeConfig(config: SequelizeOptions = sequelizeConfig): void {
    this.sequelizeConfiguration = config;
  }

  setSchema(subdomain: string): void {
    this.sequelizeConfiguration = {
      ...this.sequelizeConfiguration,
      ...{ schema: subdomain },
    }; //.schema = subdomain;
    console.log('setting schema', subdomain);
    this.setSequelizeConfig(this.sequelizeConfiguration);
  }
}
