import { DynamicModule, Module } from '@nestjs/common';
import { RedisModule as IoRedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';

@Module({})
export class RedisModule {
  static forRootAsync(): DynamicModule {
    const imports: any[] = [];
    const providers = [RedisService];
    const exports: any[] = [RedisService];

    // 只有在USE_REDIS=true时才导入IoRedisModule
    if (process.env.USE_REDIS === 'true') {
      imports.push(
        IoRedisModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'single',
            url: `redis://${configService.get<string>('REDIS_HOST')}:${configService.get<string>('REDIS_PORT')}`,
          }),
        }),
      );
      exports.push(IoRedisModule);
    }

    return {
      module: RedisModule,
      imports,
      exports,
      providers,
      controllers: [RedisController],
    };
  }
}
