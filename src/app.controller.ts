import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './common/guards/jwt-auth/jwt-auth.guard';
// import { Equ } from 'generated/prisma';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 测试数据库连接用例
  // @Get('/find/equ')
  // async getEquByOID(): Promise<{ rows: Equ[], total: number }> {
  //   return await this.appService.getEquByOid();
  // }

  @UseGuards(JwtAuthGuard)
  @Get('/test')
  async bffTest(): Promise<string> {
    // await this.appService.bffTest();
    return 'hello world';
  }
}
