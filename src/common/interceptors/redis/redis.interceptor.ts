import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  ServiceUnavailableException,
  Optional,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisInterceptor implements NestInterceptor {
  constructor(
    private readonly configService: ConfigService,
    @Optional()
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  private async checkRedisConnection(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch (_) {
      return false;
    }
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const useRedis: boolean = this.configService.get('USE_REDIS') === 'true';
    if (!useRedis) {
      throw new Error('Redis is not enabled');
    }

    const isRedisConnected = await this.checkRedisConnection();

    if (!isRedisConnected) {
      throw new ServiceUnavailableException('Redis is not connected');
    }
    // 限制请求频率
    const key = `rate-limit:${context.switchToHttp().getRequest().ip}`;
    const RATE_LIMIT =
      this.configService.get<string>('REDIS_RATE_LIMIT') ?? '100';
    // 频率限制时间（单位：秒）
    const RATE_LIMIT_TIME =
      this.configService.get<string>('REDIS_RATE_LIMIT_TIME') ?? '60';
    const currentRequestCount = await this.redis.incr(key);
    // 超出频率限制
    if (currentRequestCount > Number(RATE_LIMIT)) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    // 设置过期时间
    if (currentRequestCount === 1) {
      await this.redis.expire(key, Number(RATE_LIMIT_TIME));
    }

    return next.handle().pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}
