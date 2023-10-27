// import { Model } from 'mongoose';

import { Model, ModelCtor } from 'sequelize-typescript';

export interface BaseInterfaceRepository<T extends Model<T>> {
  getRepo<K extends Model<any, any>>(entityModel: ModelCtor<K>): ModelCtor<K>;
}

// export interface BaseInterfaceRepository<T extends ModelCtor> {
//   create(data: any): Promise<Model<any, any>>;

//   findOneById(id: number): Promise<Model<any, any>>;
//   findByCondition(filterCondition: any): Promise<Model<any, any>[]>;

//   findOneByCondition(filterCondition: any): Promise<Model<any, any>>;

//   findAll(entityModel: new () => T): Promise<Model<any, any>[]>;

//   remove(id: number): Promise<void>;
//   // getRepo<K extends Model<any, any>>(entityModel: ModelCtor<K>): ModelCtor<K>;

//   findOneWhere(filterCondition: any): Promise<Model<any, any>>;

//   findWhere(filterCondition: any): Promise<Model<any, any>[]>;

//   UpdateOne(entity: T, data: any): Promise<[number]>;

//   createBulk(dto: any): Promise<{ inserted: number; data: Model<any, any>[] }>;
//   count(filterCondition: any): Promise<number>;
//   schema(schema: string): any;
// }
