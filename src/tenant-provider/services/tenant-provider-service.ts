import { Model, ModelCtor } from 'sequelize-typescript';
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { SchemaService } from 'src/database-module/service/schema.service';

type EntityModelMap = {
  [key: string]: ModelCtor<any>;
};

export class TenantProviderService<T extends Model<T, T>> {
  constructor(
    protected readonly repository: BaseInterfaceRepository<T>,
    protected readonly entityModel: ModelCtor<T>,
  ) {
    this.registerEntity(entityModel);
  }

  protected get tenantRepoInstance() {
    return this.fetchTenantRepoInstance();
  }

  protected get publicRepoInstance() {
    return this.fetchPublicRepoInstance();
  }

  private fetchTenantRepoInstance = () => {
    if (!TenantProviderService.entities[this.entityModel.name])
      throw new Error(
        'Model not registered (Register it by calling registerEntity(entity: ModelCtor) method ).',
      );
    return this.repository
      .getRepo(this.entityModel)
      .schema(SchemaService.get());
  };
  private fetchPublicRepoInstance = () => {
    return this.repository.getRepo(this.entityModel).schema('public');
  };
  private static entities: EntityModelMap = {};
  // private entities2 = {
  //   'Tenant': this.entityModel,
  //   'User': this.entityModel,
  // };

  protected async registerEntity(entity: ModelCtor) {
    console.log(
      'registering module',
      Object.keys(TenantProviderService.entities),
    );
    if (!TenantProviderService.entities[entity.name]) {
      TenantProviderService.entities[entity.name] = entity;
      console.log('registering module', entity.name);
    }
  }

  protected async createSchema(schemaName: string) {
    try {
      // check if schema exist
      const schemaExistSql = `SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?`;
      let [schemaExist] = await this.publicRepoInstance.sequelize.query(
        schemaExistSql,
        {
          replacements: [schemaName],
        },
      );
      if (schemaExist.length == 0) {
        // schema doesnt exist
        await this.publicRepoInstance.sequelize
          .getQueryInterface()
          .createSchema(schemaName);
        [schemaExist] = await this.publicRepoInstance.sequelize.query(
          schemaExistSql,
          {
            replacements: [schemaName],
          },
        );
      }
      return schemaExist != undefined && schemaExist != null;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  protected async applyMigrationsToTenant(schema: string) {
    try {
      // apply migration to migrate registere entities
      Object.values(TenantProviderService.entities).forEach((entity) => {
        this.repository.getRepo(entity).schema(schema).sync({ alter: true });
      });
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  protected async deleteSchema(schemaName: string) {
    try {
      // query to Drop all tables in the schema
      // Create a new DbCommand query for dropping the table
      // Drop the schema query
      // execute the queries from above
      const schemaExistSql = `SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = ?`;
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }
}
