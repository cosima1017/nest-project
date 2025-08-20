import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { PrismaModule } from 'src/common/providers/prisma/prisma.module';
import { RoleController } from './role.controller';

@Module({
  providers: [RoleService],
  imports: [PrismaModule],
  controllers: [RoleController],
})
export class RoleModule {}
