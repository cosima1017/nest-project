import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PrismaModule } from 'src/common/providers/prisma/prisma.module';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  imports: [PrismaModule],
})
export class UploadModule {}
