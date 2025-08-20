import { Module } from '@nestjs/common';
import { MarkerController } from './marker.controller';
import { MarkerService } from './marker.service';
import { PrismaModule } from 'src/common/providers/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MarkerController],
  providers: [MarkerService],
})
export class MarkerModule {}
