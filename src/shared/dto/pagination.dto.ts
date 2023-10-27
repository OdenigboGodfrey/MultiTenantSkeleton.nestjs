/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { Model, FindOptions, Op } from 'sequelize';
import { BaseInterfaceRepository } from './../../repositories/base/base.interface.repository';
import { ModelCtor } from 'sequelize-typescript';

export class PaginationParameterRequestDTO {
  public constructor(init?: Partial<PaginationParameterRequestDTO>) {
    // Object.assign(this, init);
    if (init?.Recent) this.Recent = init.Recent;
    if (init?.pageNumber) this.pageNumber = init.pageNumber;
    if (init?.pageSize) this.pageSize = init.pageSize;
    if (init?.startDate) this.startDate = init.startDate;
    if (init?.endDate) this.endDate = init.endDate;
    if (init?.search) this.search = init.search;
    if (init?.Recent) this.Recent = init.Recent;

    this.offset = (this.pageNumber - 1) * this.pageSize;
  }
  @ApiProperty({ type: Number, required: false })
  pageNumber? = 1;
  @ApiProperty({ type: Number, required: false })
  pageSize? = 10;
  @ApiProperty({ type: Date, required: false })
  startDate?: Date;
  @ApiProperty({ type: Date, required: false })
  endDate?: Date;
  @ApiProperty({ type: String, required: false })
  search?: string;
  @ApiProperty({ type: Boolean, required: false, default: false })
  Recent?: boolean;
  offset: number;
}

export class PaginationParameterResponseDTO<T> {
  public constructor(init?: Partial<PaginationParameterResponseDTO<T>>) {
    Object.assign(this, init);
  }
  @ApiProperty({ type: Array<T> })
  rows: Array<T> = [];
  @ApiProperty()
  count = 1;
  @ApiProperty()
  totalPages: number = 1;
}

export class PaginationParameterDTO extends PaginationParameterRequestDTO {
  async fetchPaginatedRecords<T>(
    model: any,
    { query, sort, include, attributes }: any,
  ): Promise<T[]> {
    const { offset, pageSize } = this;
    const options: FindOptions<any> = {
      where: query,
      order: sort,
      offset: offset ? offset : 0,
      limit: pageSize ? pageSize : 10,
      include: include ? include : undefined,
      attributes: attributes ? attributes : undefined,
    };
    // const repo = repository;
    return model.findAll(options);
  }

  async count<K>(model: any, query): Promise<number> {
    return await model.count(query);
  }

  totalPages({ count }) {
    const totalPages = Math.ceil(count / (this.pageSize ? this.pageSize : 10));
    return totalPages;
  }

  buildQuery(query: any = {}, sort: any[] = []) {
    let _sort = sort;
    if (this.startDate) {
      this.startDate = new Date(this.startDate);
      query.createdAt = { [Op.gte]: this.startDate };
    }

    if (this.endDate) {
      this.endDate = new Date(this.endDate);
      query.createdAt = {
        ...query.createdAt,
        [Op.lt]: this.endDate,
      };
    }

    if (this.startDate && this.endDate) {
      query.createdAt = {
        [Op.gte]: this.startDate,
        [Op.lt]: this.endDate,
      };
    }

    if (this.search && query.search) {
      query[query.search] = { [Op.like]: `%${this.search}%` };
      delete query.search;
    }

    if (this.Recent + '' == 'false') {
      _sort = sort.concat(['createdAt', 'asc']);
    } else {
      _sort = sort.concat(['createdAt', 'desc']);
    }

    return { where: query, order: [_sort] };
  }
}
