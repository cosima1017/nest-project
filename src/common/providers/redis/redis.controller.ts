import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisInterceptor } from 'src/common/interceptors/redis/redis.interceptor';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('/hello')
  @UseInterceptors(RedisInterceptor)
  async getHello() {
    return await this.redisService.getHello();
  }
}
