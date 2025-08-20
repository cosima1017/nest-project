import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  providers: [WsGateway],
  exports: [WsGateway],
  imports: [AuthModule],
})
export class WsModule {}
