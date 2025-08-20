import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;


@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
    }),
  ],
})
export class ConfigModule {}
