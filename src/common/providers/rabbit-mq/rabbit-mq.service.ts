import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('RABBITMQ_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.client.connect();
    console.log('RabbitMQ connected');
  }

  async onModuleDestroy() {
    await this.client.close();
    console.log('RabbitMQ disconnected');
  }

  /**
   * 发送消息并等待响应
   * @param pattern 路由模式
   * @param data 发送的数据
   * @returns Promise<T>
   */
  async send<T>(pattern: string, data: any): Promise<T> {
    try {
      return await firstValueFrom(this.client.send<T>(pattern, data));
    } catch (error) {
      throw new Error(`RabbitMQ send error: ${error.message || error}`);
    }
  }

  /**
   * 发送事件消息（不等待响应）
   * @param pattern 路由模式
   * @param data 发送的数据
   * @returns Promise<boolean>
   */
  async emit<T>(pattern: string, data: any): Promise<boolean> {
    try {
      await firstValueFrom(this.client.emit<T>(pattern, data));
      return true;
    } catch (error) {
      throw new Error(`RabbitMQ emit error: ${error.message || error}`);
    }
  }

  /**
   * 关闭RabbitMQ连接
   */
  async close(): Promise<void> {
    await this.client.close();
  }

  getClient(): ClientProxy {
    return this.client;
  }
}
