import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

// 基础查询选项接口
interface IBaseQueryOptions<TWhere = Record<string, unknown>> {
  where?: TWhere;
  include?: Record<string, boolean>;
  orderBy?: Record<string, 'asc' | 'desc'> | Record<string, 'asc' | 'desc'>[];
  select?: Record<string, boolean>;
  omit?: Record<string, boolean>;
}

// 分页查询选项接口
interface IPaginatedQueryOptions<TWhere = Record<string, unknown>>
  extends IBaseQueryOptions<TWhere> {
  skip?: number;
  take?: number;
}

// 服务层查询选项接口
interface IServiceQueryOptions<TWhere = Record<string, unknown>> {
  where?: TWhere;
  include?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'> | Record<string, 'asc' | 'desc'>[];
  select?: Record<string, boolean>;
  page?: number;
  pageSize?: number;
  omit?: Record<string, boolean>;
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private buildQueryOptions<TWhere extends Record<string, unknown>>(
    options: IServiceQueryOptions<TWhere>,
  ): IPaginatedQueryOptions<TWhere> {
    const queryOptions: IPaginatedQueryOptions<TWhere> = {};

    if (options.where) {
      queryOptions.where = options.where;
    }

    if (options.include) {
      queryOptions.include = options.include;
    }

    if (options.orderBy) {
      queryOptions.orderBy = options.orderBy;
    }

    if (options.select) {
      queryOptions.select = options.select;
    }

    if (options.omit) {
      queryOptions.omit = options.omit;
    }

    if (options.page !== undefined && options.pageSize !== undefined) {
      queryOptions.skip = (options.page - 1) * options.pageSize;
      queryOptions.take = options.pageSize;
    }

    return queryOptions;
  }

  async findOne<T, TWhere extends Record<string, unknown>>(
    model: string,
    options: IServiceQueryOptions<TWhere>,
  ): Promise<T | null> {
    const queryOptions = this.buildQueryOptions<TWhere>(options);
    return await this[model].findFirst(queryOptions);
  }

  async findMany<T, TWhere extends Record<string, unknown>>(
    model: string,
    options: IServiceQueryOptions<TWhere>,
  ): Promise<T[]> {
    const queryOptions = this.buildQueryOptions<TWhere>(options);
    return await this[model].findMany(queryOptions);
  }

  async findAndCount<T, TWhere extends Record<string, unknown>>(
    model: string,
    options: IServiceQueryOptions<TWhere>,
  ): Promise<{ rows: T[]; total: number }> {
    const queryOptions = this.buildQueryOptions<TWhere>(options);
    const [rows, total] = await Promise.all([
      this[model].findMany(queryOptions),
      this[model].count({ where: queryOptions.where }),
    ]);
    return { rows, total };
  }

  async create<T, TData extends Record<string, unknown>>(
    model: string,
    data: TData,
  ): Promise<T> {
    return await this[model].create({ data });
  }

  async update<
    T,
    TWhere extends Record<string, unknown>,
    TData extends Record<string, unknown>,
  >(model: string, where: TWhere, data: TData): Promise<T> {
    return await this[model].update({ where, data });
  }

  async delete<T, TWhere extends Record<string, unknown>>(
    model: string,
    where: TWhere,
  ): Promise<T> {
    return await this[model].delete({ where });
  }

  getFuzzySearchQuery(
    query: Record<string, unknown>,
    fields?: string[],
  ): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        if (fields && fields.includes(key)) {
          where[key] = { contains: value };
        } else {
          where[key] = value;
        }
      }
    }
    return where;
  }
}
