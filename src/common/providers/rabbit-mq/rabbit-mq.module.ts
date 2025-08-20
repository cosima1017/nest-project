import { Module, DynamicModule } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitmqConfig } from './rabbit-mq.config';
import { RabbitMqService } from './rabbit-mq.service';
import { RabbitMqController } from './rabbit-mq.controller';
import { ScheduleModule } from '@nestjs/schedule';
@Module({})
export class RabbitMqModule {
  static forRoot(): DynamicModule {
    const imports: any[] = [ScheduleModule.forRoot()];
    const providers: any[] = [];
    const exports: any[] = [];
    const controllers: any[] = [];
    if (process.env.RABBITMQ_REQUIRE === 'true') {
      imports.push(
        ClientsModule.register([
          {
            name: 'RABBITMQ_SERVICE',
            ...rabbitmqConfig,
          },
        ]),
      );
      // imports.push(ScheduleModule.forRoot());
      providers.push(RabbitMqService);
      exports.push(RabbitMqService, ClientsModule);
      controllers.push(RabbitMqController);
    }

    return {
      module: RabbitMqModule,
      imports,
      providers,
      exports,
      controllers,
    };
  }
}
