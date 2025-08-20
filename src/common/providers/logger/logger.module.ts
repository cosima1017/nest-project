import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import {
  consoleTransport,
  createDailyRotateTransport,
} from './creatDailyRotateTransport';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logOn = configService.get<boolean>('LOG_ON');
        return {
          transports: [
            consoleTransport,
            ...(logOn
              ? [
                  createDailyRotateTransport('info', 'application'),
                  createDailyRotateTransport('error', 'error'),
                ]
              : []),
          ],
        };
      },
    }),
  ],
})
export class LoggerModule {}
