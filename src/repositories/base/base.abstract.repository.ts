/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Model, ModelCtor } from 'sequelize-typescript';
import { BaseInterfaceRepository } from './base.interface.repository';
// import { Model } from 'sequelize';

@Injectable()
export class BaseAbstractRepository<T extends Model<T>>
  implements BaseInterfaceRepository<T>
{
  constructor() {}
  schemaName: string = 'public';

  setSchema(schemaName: string) {
    this.schemaName = schemaName;
    return this;
  }
  getRepo<K extends Model<any, any>>(entityModel: ModelCtor<K>): ModelCtor<K> {
    return entityModel;
  }
}

// @Injectable()
// export class BaseAbstractRepository<T extends ModelCtor>
//   implements BaseInterfaceRepository<T>
// {
//   constructor(entity: T) {
//     this.entity = entity;
//   }
//   schemaName: string = 'public';

//   private entity: T;

//   schema(schemaName: string) {
//     this.schemaName = schemaName;
//     return this;
//   }
//   async count(filterCondition: any): Promise<number> {
//     const result = await this.entity.count({ where: filterCondition });
//     return result;
//   }
//   findByCondition(filterCondition: any): Promise<Model<any, any>[]> {
//     return this.entity.findAll({
//       where: filterCondition,
//     });
//   }
//   findOneByCondition(filterCondition: any): Promise<Model<any, any>> {
//     return this.entity.findOne({
//       where: filterCondition,
//     });
//   }
//   findAll(): Promise<Model<any, any>[]> {
//     return this.entity.findAll();
//   }
//   // getRepo<K extends Model<any, any>>(entityModel: ModelCtor<K>): ModelCtor<K> {
//   //   return entityModel;
//   // }

//   findOneWhere(filterCondition: any): Promise<Model<any, any>> {
//     return this.entity.findOne({
//       where: filterCondition,
//     });
//   }
//   findWhere(filterCondition: any): Promise<Model<any, any>[]> {
//     return this.entity.findAll({
//       where: filterCondition,
//     });
//   }

//   async createBulk(
//     dto: any,
//   ): Promise<{ inserted: number; data: Model<any, any>[] }> {
//     // const entity = this.getRepo(entityModel);
//     const insertedData = await this.entity.bulkCreate(dto);
//     return { inserted: insertedData.length, data: insertedData };
//   }

//   async create(data: any): Promise<Model<any, any>> {
//     return this.entity.create(data);
//   }

//   async findOneById(id: number): Promise<Model<any, any>> {
//     return this.entity.findByPk(id);
//   }

//   async UpdateOne(entity: T, data: any): Promise<[number]> {
//     const where = { where: { id: entity['id'] } };
//     return this.entity.update(data, where);
//     // return entity;
//   }

//   async remove(id: number): Promise<void> {
//     await this.entity.destroy({ where: { id } });
// }

// }
