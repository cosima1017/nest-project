import { Injectable } from '@nestjs/common';
import { PrismaService } from './common/providers/prisma/prisma.service';
// import { Equ } from 'generated/prisma';
import { AxiosService } from './common/providers/axios/axios.service';

@Injectable()
export class AppService {
  constructor(
    private readonly Prisma: PrismaService,
    private readonly Axios: AxiosService,
  ) {}

  // 测试数据库连接用例
  // async getEquByOid(): Promise<{ rows: Equ[], total: number }> {
  //   return await this.Prisma.findAndCount('equ', {
  //     orderBy: {
  //       OID: 'desc'
  //     },
  //     page: 1,
  //     pageSize: 10
  //   })
  // }
  // // bff测试用例
  async bffTest(): Promise<void> {
    const res = await this.Axios.post('http://127.0.0.1:8000/api/addUser1', {
      username: 'test',
      password: '123456',
      phone: '12345678901',
    });
    console.log(res);
  }
}
