import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BaseGateway } from './base.gateway';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  // namespace: 'ws1',
  // path: '/ws',
})
export class WsGateway extends BaseGateway {
  @SubscribeMessage('message1')
  handleMessage(client: Socket, payload: any): void {
    console.log('message1', payload);
    client.emit('message1', payload);
  }
}
