import { Injectable } from '@nestjs/common';
import { IPaginatedResponse } from 'src/common/interfaces/response.interface';
import { IRole } from 'src/common/interfaces/role.interface';
import { IUser } from 'src/common/interfaces/user.interface';
import { PrismaService } from 'src/common/providers/prisma/prisma.service';
import { FindPagenationRoleDto } from './dto/find-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly PrismaService: PrismaService) {}

  async createRole(dto: Partial<IRole>, user: IUser): Promise<IRole> {
    return await this.PrismaService.create<IRole, Partial<IRole>>('roles', {
      ...dto,
      createdBy: user.id,
    });
  }

  async updateRole(
    id: number,
    dto: Partial<IRole>,
    user: any = {},
  ): Promise<void> {
    try {
      await this.PrismaService.update<
        IRole,
        {
          id: number;
        },
        Partial<IRole>
      >(
        'roles',
        { id },
        {
          ...dto,
          updatedBy: user.id,
          // updatedAt: new Date(),
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async getRoleById(id: number): Promise<IRole | {}> {
    return (
      (await this.PrismaService.findOne<
        IRole,
        {
          id: number;
        }
      >('roles', {
        where: { id },
      })) || {}
    );
  }

  async getAllAndCountRoles(
    query: FindPagenationRoleDto,
  ): Promise<IPaginatedResponse<IRole>> {
    const { page, pageSize, ...rest } = query;
    const where: Record<string, unknown> =
      this.PrismaService.getFuzzySearchQuery(rest, ['name', 'code']);
    const roles = await this.PrismaService.findAndCount<
      IRole,
      Record<string, unknown>
    >('roles', {
      where,
      page,
      pageSize,
    });

    return {
      rows: roles.rows ?? [],
      total: roles.total ?? 0,
    };
  }

  async deleteRole(id: number): Promise<IRole> {
    return await this.PrismaService.delete<IRole, { id: number }>('roles', {
      id,
    });
  }
}
