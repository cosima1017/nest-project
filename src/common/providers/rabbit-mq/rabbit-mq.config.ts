import { Transport, RmqOptions } from '@nestjs/microservices';
export const rabbitmqConfig: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: 'main_queue',
    queueOptions: {
      durable: false,
    },
  },
};
