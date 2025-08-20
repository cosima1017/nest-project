import { PrismaService } from '../../common/providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import type { IUser } from 'src/common/interfaces/user.interface';
import { FindUserPageDto } from './dto/find-user.dto';
// import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly PrismaService: PrismaService) {}

  async findUserById(id: number): Promise<IUser | {}> {
    const user = await this.PrismaService.findOne<IUser, { id: number }>(
      'users',
      {
        where: { id },
        omit: {
          password: true,
        },
      },
    );
    return user ? user : {};
  }

  async updateUser(
    id: number,
    data: Partial<IUser>,
    user: any = {},
  ): Promise<void> {
    await this.PrismaService.update(
      'users',
      {
        id,
      },
      {
        ...data,
        updatedBy: user.id,
      },
    );
  }

  async deleteUser(id: number): Promise<void> {
    await this.PrismaService.delete('users', {
      id,
    });
  }

  async findAllUsers(query: FindUserPageDto): Promise<{
    rows: IUser[] | [];
    total: number;
  }> {
    const { page, pageSize, ...rest } = query;
    // 只保留有效的查询条件
    let where: Record<string, any> = {};
    where = this.PrismaService.getFuzzySearchQuery(rest, ['username']);
    const users = await this.PrismaService.findAndCount<
      IUser,
      Record<string, any>
    >('users', {
      where,
      page,
      pageSize,
      omit: {
        password: true,
      },
      include: {
        userRoles: {
          include: {
            roles: {
              select: {
                id: true,
                name: true,
                code: true,
                status: true,
              },
            },
          },
        },
      },
    });

    const transformedUsers = users.rows.map((user) => ({
      ...user,
      roles: user?.userRoles?.map((ur) => ur.roles),
      userRoles: undefined, // 移除 userRoles
    }));

    return {
      rows: transformedUsers || [],
      total: users?.total || 0,
    };
  }

  async createUser(data: Partial<IUser>, info: any): Promise<IUser> {
    const { roleIds, id: _, ...userData } = data;

    // 确保必填字段存在
    if (!userData.username || !userData.password) {
      throw new Error('用户名和密码是必填项');
    }

    return await this.PrismaService.$transaction(async (t) => {
      const user = await t.users.create({
        data: {
          username: userData.username!,
          password: userData.password!,
          nickname: userData.nickname ?? null,
          email: userData.email ?? null,
          phone: userData.phone ?? null,
          avatar: userData.avatar ?? null,
          status: userData.status ?? true,
          createdBy: info.id ?? null,
          userRoles: roleIds?.length
            ? {
                create: roleIds.map((roleId) => ({
                  roleId,
                  createdBy: userData.createdBy ?? null,
                })),
              }
            : undefined,
        },
        include: {
          userRoles: {
            include: {
              roles: true,
            },
          },
        },
      });

      return user;
    });
  }
}
