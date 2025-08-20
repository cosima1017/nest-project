import { UserService } from './../user/user.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../common/providers/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import type { IUser } from 'src/common/interfaces/user.interface';

interface IAuthUser
  extends Omit<IUser, 'password' | 'createdAt' | 'updatedAt'> {}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IAuthUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly UserService: UserService,
  ) {}

  private async findUserByUsername(username: string): Promise<IUser | null> {
    return this.prisma.findOne<IUser, { username: string }>('users', {
      where: { username },
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
      omit: {
        lastLoginTime: true,
        lastLoginIp: true,
        updatedAt: true,
        createdAt: true,
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  private async validateUser(
    username: string,
    password: string,
  ): Promise<IAuthUser> {
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    if (!user.status) {
      throw new UnauthorizedException('用户已禁用');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('密码错误');
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async register(dto: RegisterDto): Promise<void> {
    const { username, password, phone, email, nickname } = dto;

    const existingUser = await this.findUserByUsername(username);
    if (existingUser) {
      throw new BadRequestException('用户名已存在');
    }

    await this.prisma.create('users', {
      username,
      password,
      nickname,
      phone,
      email,
    });
  }

  async login(dto: LoginDto, ip: string | undefined): Promise<ILoginResponse> {
    try {
      const user = await this.validateUser(dto.username, dto.password);

      const transformedUser = {
        ...user,
        roles: user?.userRoles?.map((item) => item.roles) || [],
        userRoles: undefined,
      };

      const payload = {
        username: transformedUser.username,
        id: transformedUser.id,
        nickname: transformedUser.nickname,
        phone: transformedUser.phone,
        email: transformedUser.email,
        roles: transformedUser.roles,
      };

      await this.UserService.updateUser(user.id, {
        lastLoginTime: new Date(),
        lastLoginIp: ip,
      });

      const { accessToken, refreshToken } = await this.generateToken(payload);

      return {
        accessToken,
        refreshToken,
        user: transformedUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async generateToken(payload: any): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // 生成访问令牌，短期有效
    const accessToken = this.jwtService.sign(payload);

    // 生成刷新令牌，长期有效
    const refreshToken = this.jwtService.sign(
      {
        id: payload.id,
        type: 'refresh',
      },
      {
        expiresIn: '7d',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  validateToken(token: string): boolean {
    try {
      const tokenValue = token.replace('Bearer ', '');

      const decoded = this.jwtService.verify(tokenValue);

      return !!decoded;
    } catch (_) {
      return false;
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    user: IAuthUser;
  }> {
    try {
      // 验证刷新令牌
      const payload = this.jwtService.verify(refreshToken);

      // 确保这是一个刷新令牌
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('无效的刷新令牌');
      }

      // 获取用户信息
      const user = (await this.UserService.findUserById(payload.id)) as IUser;
      if (!user || Object.keys(user).length === 0) {
        throw new UnauthorizedException('用户不存在');
      }

      if (!user.status) {
        throw new UnauthorizedException('用户已禁用');
      }

      const transformedUser = {
        ...user,
        roles: user?.userRoles?.map((item) => item.roles) || [],
        userRoles: undefined,
        password: undefined,
      };

      // 生成新的访问令牌
      const newPayload = {
        username: transformedUser.username,
        id: transformedUser.id,
        nickname: transformedUser.nickname,
        phone: transformedUser.phone,
        email: transformedUser.email,
        roles: transformedUser.roles,
      };

      const accessToken = this.jwtService.sign(newPayload);

      return {
        accessToken,
        user: {
          ...newPayload,
          status: user.status,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('刷新令牌已过期，请重新登录');
      }
      throw error;
    }
  }
}
