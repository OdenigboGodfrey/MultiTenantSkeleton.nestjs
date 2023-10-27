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

  private async getSchema(schemaName) {
    try {
      const schemaExistSql = `SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?`;
      const [schemaExist] = await this.publicRepoInstance.sequelize.query(
        schemaExistSql,
        {
          replacements: [schemaName],
        },
      );
      return schemaExist;
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  protected async createSchema(schemaName: string) {
    try {
      // check if schema exist
      let schemaExist = await this.getSchema(schemaName);
      if (schemaExist.length == 0) {
        // schema doesnt exist
        await this.publicRepoInstance.sequelize
          .getQueryInterface()
          .createSchema(schemaName);
        schemaExist = await this.getSchema(schemaName);
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

  async deleteSchema(schemaName: string): Promise<boolean> {
    try {
      // Drop all tables in the schema
      const tables = async () =>
        await this.publicRepoInstance.sequelize.query(
          `SELECT * FROM information_schema.tables WHERE table_schema = '${schemaName}'`,
        );
      let dependenciesSQL = '';

      let sql: string = '';
      const _tables = await tables();
      for (const table of _tables[0]) {
        const tableName = table['table_name'];
        // get dependecies/constraints
        const dependencies = await this.findTableDependencies(
          schemaName,
          tableName,
        );
        for (const dependency of dependencies) {
          // Drop foreign key constraints and other dependent objects here.
          dependenciesSQL += `ALTER TABLE "${schemaName}"."${tableName}" DROP CONSTRAINT IF EXISTS "${dependency}";`;
        }
        sql += `DROP TABLE "${schemaName}"."${tableName}" cascade;`;
      }

      // Drop the schema
      sql += `DROP SCHEMA "${schemaName}" cascade;`;
      sql = `${dependenciesSQL}${sql}`;
      // console.log('sql', sql);
      await this.publicRepoInstance.sequelize.query(sql);

      // Check if the schema still exists
      return (await this.getSchema(schemaName)).length == 0;
    } catch (e) {
      console.error(`Exception: ${e.message} ${e.stack}`);
    }
    return false;
  }

  private async findTableDependencies(
    schemaName: string,
    tableName: string,
  ): Promise<string[]> {
    const query = `
      SELECT conname
      FROM pg_constraint
      WHERE confrelid = (
        SELECT oid
        FROM pg_class
        WHERE relname = '${tableName}' AND relnamespace = (
          SELECT oid
          FROM pg_namespace
          WHERE nspname = '${schemaName}'
        )
      );
    `;

    const [result] = await this.publicRepoInstance.sequelize.query(query);
    const dependencies = result.map((row: any) => row.conname);
    return dependencies;
  }
}
