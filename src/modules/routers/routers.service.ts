import { Injectable } from '@nestjs/common';
import {
  IPaginatedResponse,
  IResponse,
} from 'src/common/interfaces/response.interface';
import { IRouter } from 'src/common/interfaces/router.interface';
import { PrismaService } from 'src/common/providers/prisma/prisma.service';
import { getTree } from 'src/utils';

@Injectable()
export class RoutersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAndCount(): Promise<IPaginatedResponse<any>> {
    const routers = await this.prismaService.findAndCount('permissions', {});
    const tree = getTree(routers.rows as any[], 'parentId', 'id');
    return {
      rows: tree,
      total: routers.total,
    };
  }

  async createRouter(router: Partial<IRouter>): Promise<IResponse<any>> {
    await this.prismaService.create('permissions', router);
    return {
      message: '添加成功',
    };
  }

  async updateRouter(router: Partial<IRouter>): Promise<IResponse<any>> {
    const { id, ...rest } = router;
    await this.prismaService.update(
      'permissions',
      {
        id,
      },
      rest,
    );
    return {
      message: '更新成功',
    };
  }

  async deleteRouter(id: number): Promise<IResponse<any>> {
    await this.prismaService.delete('permissions', { id });
    return {
      message: '删除成功',
    };
  }
}
