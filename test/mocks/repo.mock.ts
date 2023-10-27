/* eslint-disable @typescript-eslint/no-unused-vars */
import { randomUUID } from 'crypto';

export class MockRepo<T> {
  dataStore: T[] = [];
  prepareArgs(args: any) {
    let key, value;
    if (Array.isArray(args)) {
      key = Object.keys(args[0]);
      key = key[0];
      value = args[0][key];
    } else if (typeof args == 'object') {
      key = Object.keys(args);
      key = key[0];
      value = args[key];
    } else {
      key = 'id';
      value = args;
    }
    return { key, value };
  }

  prepareResponse(dto: any) {
    if (Array.isArray(dto)) {
      return dto.map((x) => {
        return { dataValues: x };
      });
    } else {
      return { dataValues: dto };
    }
  }

  async create(entityModel, dto: T) {
    if (!dto['id']) dto['id'] = randomUUID();
    this.dataStore.push(dto);
    return this.prepareResponse(dto);
  }

  async findOneById(entityModel, id: any) {
    id = this.prepareArgs(id);
    const _key: any = id.key;
    const _value: any = id.value;
    const result = this.dataStore.filter((x) => x[_key] == _value)[0];
    return this.prepareResponse(result);
  }
  async findByCondition(entityModel, filterCondition) {
    return this.prepareResponse(this.dataStore);
  }

  async findAll(entityModel) {
    return this.prepareResponse(this.dataStore);
  }

  async remove(entityModel, id: string) {
    this.dataStore = this.dataStore.filter((x) => x['id'] != id);
  }

  async deleteOne(entityModel, args) {
    args = this.prepareArgs(args);
    const _key: any = args.key;
    const _value: any = args.value;
    this.dataStore = this.dataStore.filter((x) => x[_key] != _value);
  }

  getRepo(entityModel) {
    return {
      updateOne: (id, dto) => {
        this.dataStore.filter((x) => x['id'] == id)[0] = dto;
        return { acknowledged: true };
      },
      deleteOne: (args) => {
        args = this.prepareArgs(args);
        const _key: any = args.key;
        const _value: any = args.value;
        this.dataStore = this.dataStore.filter((x) => x[_key] != _value);
      },
      findOne: (args, fields, sort, callback) => {
        callback(undefined, this.findOneByCondition(entityModel, args));
        return this.findOneByCondition(entityModel, args);
      },
      find: (args, fields, callback) => {
        if (callback)
          return callback(undefined, this.findWhere(entityModel, args));
        return {
          sort: (args) => {
            return {
              skip: (args) => {
                // return callback(undefined, );
                return {
                  limit: () => this.findWhere(entityModel, args),
                };
              },
            };
          },
        };
        //  this.findOneByCondition(args);
      },
      sort: (args) => {
        // return callback(undefined, );
        return this.findOneByCondition(entityModel, args);
      },
      count: (args) => {
        return this.dataStore.length;
      },
      findAll: (args) => {
        return this.findByCondition(entityModel, args);
      },
    };
  }

  findOneByCondition(entityModel, payload: any) {
    return this.prepareResponse(this.dataStore[0]);
  }

  findOneWhere(entityModel, args: any) {
    args = this.prepareArgs(args);
    const _key: any = args.key;
    const _value: any = args.value;
    const result = this.dataStore.filter((x) => x[_key] == _value)[0] || null;
    return this.prepareResponse(result);
  }

  findWhere(entityModel, args: any) {
    args = this.prepareArgs(args);
    const _key: any = args.key;
    const _value: any = args.value;
    const result = this.dataStore.filter((x) => x[_key] == _value) || null;
    return this.prepareResponse(result);
  }

  UpdateOne(filters, dto) {
    const args = this.prepareArgs(filters);
    const _key: any = args.key;
    const _value: any = args.value;
    this.dataStore.filter((x) => x[_key] == _value)[0] = dto;
    return { acknowledged: true };
  }

  async createBulk(entityModel, dto: T[]) {
    this.dataStore = this.dataStore.concat(dto);
    return { inserted: dto.length, data: dto };
  }
  count(entityModel, args) {
    return this.dataStore.length;
  }
}
