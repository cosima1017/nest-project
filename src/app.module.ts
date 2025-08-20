import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './common/providers/config/config.module';
import { LoggerModule } from './common/providers/logger/logger.module';
import { PrismaModule } from './common/providers/prisma/prisma.module';
import { AxiosModule } from './common/providers/axios/axios.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
// import { CacheModule } from '@nestjs/cache-manager';
import { RedisModule } from './common/providers/redis/redis.module';
import { WsModule } from './common/providers/ws/ws.module';
import { RabbitMqModule } from './common/providers/rabbit-mq/rabbit-mq.module';
import { UploadModule } from './modules/upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ExportModule } from './modules/export/export.module';
import { RoutersModule } from './modules/routers/routers.module';
// import { VideoProcessingModule } from './modules/video-processing/video-processing.module';
import path from 'path';
// import { BullModule } from '@nestjs/bull';
import { MarkerModule } from './modules/map/marker/marker.module';
import { SseModule } from './modules/sse/sse.module';
@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    PrismaModule,
    AxiosModule,
    UserModule,
    AuthModule,
    RoleModule,
    // CacheModule.register({
    //   ttl: 20,
    // }),
    RedisModule.forRootAsync(),
    WsModule,
    RabbitMqModule.forRoot(),
    UploadModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ExportModule,
    RoutersModule,
    MarkerModule,
    SseModule,
    // VideoProcessingModule,
    // BullModule.forRoot({
    //   redis: {
    //     host: 'localhost',
    //     port: 6379,
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
