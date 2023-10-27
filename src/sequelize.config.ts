import * as dotenv from 'dotenv';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { User } from './modules/user/entities/user.entity';
import { Tenant } from './modules/tenant/entities/tenant.entity';
dotenv.config();
export const sequelizeConfig: SequelizeOptions = {
  dialect: 'postgres',
  host:
    process.env.NODE_ENV == 'development'
      ? process.env.PG_HOST
      : process.env.RDS_HOSTNAME,
  port:
    process.env.NODE_ENV == 'development'
      ? process.env.PG_PORT
        ? parseInt(process.env.PG_PORT)
        : 5432
      : parseInt(process.env.RDS_PORT),
  username:
    process.env.NODE_ENV == 'development'
      ? process.env.PG_USERNAME
      : process.env.RDS_USERNAME,
  password:
    process.env.NODE_ENV == 'development'
      ? process.env.PG_PASSWORD
      : process.env.RDS_PASSWORD,
  database:
    process.env.NODE_ENV == 'development'
      ? process.env.PG_DATABASENAME
      : process.env.RDS_SID,
  models: [User, Tenant], // Add all your model classes here
  logging: true,
  schema: 'public',
};
export const publicSequelizeInstance = new Sequelize(sequelizeConfig);

export const buildTenantSequelizeInstance = (schema: string) => {
  const config: SequelizeOptions = { ...sequelizeConfig };
  config.schema = schema;

  return new Sequelize(sequelizeConfig);
};
