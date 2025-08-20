import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  IResponse,
  IPaginatedResponse,
} from '../interfaces/response.interface';
import dayjs from 'dayjs';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, IResponse<T> | IPaginatedResponse<T>>
{
  private readonly successCode = 200;
  private readonly defaultMessage = 'success';

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T> | IPaginatedResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const transformedData = this.transformData(data);
        let message = this.defaultMessage;
        if (
          transformedData &&
          typeof transformedData === 'object' &&
          'message' in transformedData &&
          typeof transformedData.message === 'string'
        ) {
          message = transformedData.message;
          delete transformedData.message;
        }
        const baseResponse = {
          code: this.successCode,
          message,
        };

        // 处理分页数据
        if (this.isPaginatedData(transformedData)) {
          return {
            ...baseResponse,
            rows: transformedData.rows,
            total: transformedData.total,
          };
        }
        // 处理数组或普通对象
        return {
          ...baseResponse,
          // data: Array.isArray(transformedData) ? transformedData : data,
          data: transformedData,
        };
      }),
    );
  }

  private isPaginatedData(data: unknown): data is { rows: T[]; total: number } {
    if (!data || typeof data !== 'object') {
      return false;
    }
    const obj = data as Record<string, unknown>;
    return (
      'rows' in obj &&
      'total' in obj &&
      Array.isArray(obj.rows) &&
      typeof obj.total === 'number'
    );
  }

  private transformData(data: unknown): any {
    if (data === null || data === undefined) {
      return data;
    }
    if (
      data instanceof Object &&
      !(data instanceof Date) &&
      !Array.isArray(data)
    ) {
      const result = { ...(data as object) };
      for (const key in result) {
        if (result[key] instanceof Date) {
          result[key] = dayjs(result[key]).format('YYYY-MM-DD HH:mm:ss');
        } else if (result[key] instanceof Object) {
          result[key] = this.transformData(result[key]);
        }
      }
      return result;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.transformData(item));
    }

    if (data instanceof Date) {
      return dayjs(data).format('YYYY-MM-DD HH:mm:ss');
    }

    return data;
  }
}
