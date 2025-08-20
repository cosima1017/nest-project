import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from 'generated/prisma';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getHttpStatus(exception);
    const message = this.getErrorMessage(exception);

    // if (request.url.includes('/favicon.ico') && status === 404) {
    //   return response.status(204).send();
    // }
    const ignore = this.ignoreError(request);
    if (ignore) return response.status(status).send();

    // 记录错误日志
    this.logError(exception, request);

    const errorResponse = {
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    };

    // 如果是开发环境，添加更多错误信息
    // if (process.env.NODE_ENV !== 'production') {
    //   errorResponse['error'] = exception;
    // }

    response
      .status(status)
      .header('Content-Type', 'application/json')
      .json(errorResponse);
  }

  private getHttpStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // 数据库错误
      switch (exception.code) {
        case 'P2002':
          return HttpStatus.CONFLICT; // 唯一约束错误
        case 'P2003':
          return HttpStatus.BAD_REQUEST; // 外键约束错误
        case 'P2025':
          return HttpStatus.NOT_FOUND; // 记录未找到
        case 'P2014':
          return HttpStatus.BAD_REQUEST; // 无效的ID
        case 'P2016':
          return HttpStatus.BAD_REQUEST; // 查询条件无效
        default:
          return HttpStatus.INTERNAL_SERVER_ERROR;
      }
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      return HttpStatus.BAD_REQUEST; // 验证错误
    }

    if (exception instanceof Prisma.PrismaClientInitializationError) {
      return HttpStatus.SERVICE_UNAVAILABLE; // 数据库连接错误
    }

    if (exception instanceof Prisma.PrismaClientRustPanicError) {
      return HttpStatus.INTERNAL_SERVER_ERROR; // 数据库内部错误
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return typeof response === 'string'
        ? response
        : (response as any)?.message || exception.message;
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': {
          const target = exception.meta?.target;
          const targetStr = Array.isArray(target)
            ? target.join(', ')
            : typeof target === 'string'
              ? target
              : '未知字段';
          return `唯一约束错误: ${targetStr}`;
        }
        case 'P2003': {
          const fieldName = exception.meta?.field_name || '未知字段';
          return `外键约束错误: ${fieldName}`;
        }
        case 'P2025':
          return '记录未找到';
        case 'P2014':
          return '无效的ID';
        case 'P2016':
          return '查询条件无效';
        default:
          return '数据库操作失败';
      }
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      return '数据验证失败: ' + exception.message;
    }

    if (exception instanceof Prisma.PrismaClientInitializationError) {
      return '数据库连接失败: ' + exception.message;
    }

    if (exception instanceof Prisma.PrismaClientRustPanicError) {
      return '数据库内部错误';
    }

    return exception instanceof Error
      ? exception.message
      : 'Internal Server Error';
  }

  private logError(exception: unknown, request: Request): void {
    const errorContext = {
      url: request.url,
      method: request.method,
      headers: request.headers,
      body: request.body,
      query: request.query,
      params: request.params,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof Error) {
      this.logger.error(
        `${exception.message}\n${exception.stack}\n`,
        errorContext,
      );
    } else {
      this.logger.error('Unknown error occurred', errorContext);
    }
  }

  private ignoreError(req: any) {
    if (req.url.includes('/favicon.ico')) return true;
    if (req.url.includes('/.well-known/appspecific/com.chrome.devtools.json'))
      return true;
    return false;
  }
}
