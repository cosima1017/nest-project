import { Module } from '@nestjs/common';
import { RoutersService } from './routers.service';
import { RoutersController } from './routers.controller';
import { PrismaModule } from 'src/common/providers/prisma/prisma.module';

@Module({
  controllers: [RoutersController],
  providers: [RoutersService],
  imports: [PrismaModule],
})
export class RoutersModule {}
