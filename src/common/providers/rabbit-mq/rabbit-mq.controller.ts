import { RabbitMqService } from './rabbit-mq.service';
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { Ctx, EventPattern, RmqContext } from '@nestjs/microservices';
import { IResponse } from 'src/common/interfaces/response.interface';
import { CreateMqDto } from './dto/create-mq.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('rabbit-mq')
export class RabbitMqController {
  private readonly logger = new Logger(RabbitMqController.name);
  constructor(private readonly rabbitmqService: RabbitMqService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCleanup() {
    try {
      if (process.env.RABBITMQ_CLEAN_ENABLED !== 'true') return;
      console.log('定时任务执行');
    } catch (error) {
      this.logger.error(`定时任务执行失败: ${error.message}`, error);
    }
  }
  @EventPattern('notifications')
  async handleNotifications(data: any) {
    try {
      // 业务逻辑处理
      console.log('Received notification:', data);
    } catch (error) {
      this.logger.error(`处理消息失败: ${error.message}`, error);
      await this.handleFailedMessage(data, error);
    }
  }

  private async handleFailedMessage(data: any, error: Error): Promise<void> {
    try {
      // 发送到死信队列
      await this.rabbitmqService.emit('failed_messages', {
        originalData: data,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      // 继续处理失败消息的逻辑
    } catch (error) {
      this.logger.error(`处理失败消息失败: ${error.message}`, error);
    }
  }

  @EventPattern('failed_messages')
  async handleFailedMessages(data: any, @Ctx() context: RmqContext) {
    try {
      console.log(data, context);
      const { originalData, error, timestamp } = data;
      const retryCount = data.retryCount || 0;
      const MAX_RETRY_COUNT = 3;
      if (retryCount < MAX_RETRY_COUNT) {
        originalData.retryCount = retryCount + 1;
        await this.rabbitmqService.emit('notifications', {
          ...originalData,
          retryCount: originalData.retryCount,
          lastError: error,
          lastRetryTimestamp: timestamp,
        });
        this.logger.log(`消息重试次数: ${originalData.retryCount}次`);
      } else {
        // 处理超过最大重试次数的逻辑

        // end
        this.logger.error(
          `消息重试次数已超过最大限制: ${MAX_RETRY_COUNT}次`,
          error,
        );
      }
    } catch (error) {
      this.logger.error(`处理失败消息失败: ${error.message}`, error);
    }
  }

  @Post('send-notification')
  async sendNotification(): Promise<IResponse<void>> {
    const e = await this.rabbitmqService.emit('notifications', {
      message: 'Hello, RabbitMQ!',
    });
    if (!e) {
      throw new Error('Failed to send notification');
    }
    return { message: 'Notification sent successfully' };
  }

  @Post('create/message')
  async createMessage(@Body() dto: CreateMqDto): Promise<IResponse<void>> {
    const { pattern, data } = dto;
    const r = await this.rabbitmqService.emit(pattern, data);
    if (!r) {
      throw new Error('Failed to send message');
    }
    return { message: 'message sent successfully' };
  }
}
