import { NestFactory, NestApplication } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { loadPlugins } from './common/plugins/plugin.loader';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { rabbitmqConfig } from './common/providers/rabbit-mq/rabbit-mq.config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);
  // 使用winston日志
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // 设置全局前缀
  app.setGlobalPrefix('/api');
  // 配置CORS
  app.enableCors({
    origin: 'http://127.0.0.1:5173', // 或指定允许的域名
    credentials: true, // 允许跨域请求携带cookie
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  // 使用cookie-parser中间件
  app.use(cookieParser());
  // 注册全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 加载所有插件
  await loadPlugins(app);
  // 全局注册响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 全局参数转换
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  // 注册rabbitmq
  if (process.env.RABBITMQ_REQUIRE === 'true') {
    app.connectMicroservice<MicroserviceOptions>(rabbitmqConfig);
  }
  // 启动所有微服务
  await app.startAllMicroservices();
  // 设置端口
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
