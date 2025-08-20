import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Optional } from '@nestjs/common';
import Redis, { RedisKey } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Optional()
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async getHello() {
    await this.redis.set('key', 'Redis data!');
    const redisData = await this.redis.get('key');
    return { redisData };
  }

  /**
   * 设置键值对
   * @param key 键
   * @param value 值
   * @param ttl 过期时间（秒）
   */
  async set(key: RedisKey, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

  /**
   * 获取键值
   * @param key 键
   */
  async get(key: RedisKey): Promise<string | null> {
    return await this.redis.get(key);
  }

  /**
   * 删除键值
   * @param key 键
   */
  async del(key: RedisKey[]): Promise<number> {
    return await this.redis.del(key);
  }

  /**
   * 获取所有键值
   * @param pattern 匹配模式
   * @returns
   *   - 键值对数组
   *@example
   *  await redisService.keys('*');
   *  await redisService.keys('user:*');
   *  await redisService.keys('user:*:*');
   */
  async keys(pattern: string): Promise<string[]> {
    return await this.redis.keys(pattern);
  }

  /**
   * 是否存在键
   * @param key 键
   */
  async exists(key: RedisKey): Promise<number> {
    return await this.redis.exists(key);
  }
}
