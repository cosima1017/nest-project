import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  clients = new Map<string, Socket>();
  requireAuth: boolean;
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    this.requireAuth =
      this.configService.get<string>('WS_REQUIRE_AUTH') === 'true';
  }
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    try {
      if (this.requireAuth) {
        const token =
          client.handshake.auth.token || client.handshake.headers.authorization;
        if (!token) {
          // throw new UnauthorizedException('未传递token');
          client.emit('error', {
            code: 401,
            message: '未传递token',
          });
          client.disconnect();
          return;
        }
        const isVerify = this.authService.validateToken(token);
        if (!isVerify) {
          // throw new UnauthorizedException('token无效');
          client.emit('error', {
            code: 401,
            message: 'token无效',
          });
          client.disconnect();
          return;
        }
        this.clients.set(client.id, client);
        console.log(`Client connected: ${client.id}`);
      } else {
        console.log(`Client connected: ${client.id}`);
        this.clients.set(client.id, client);
      }
    } catch (error) {
      console.log(`WebSocket连接错误: ${error.message}`);
      client.emit('error', { message: '连接失败，请稍后重试' });
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    console.log(` Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }

  broadcast(event: string, message: Record<string, unknown>): void {
    this.server.emit(event, message);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    console.log('message', payload);
    client.emit('message', payload);
  }
}
