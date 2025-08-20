import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HashPassword } from 'src/common/decorators/password/password.decorator';
import { RegisterDto } from './dto/register.dto';
import { ILoginResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() @HashPassword() dto: RegisterDto): Promise<{
    message: string;
  }> {
    await this.authService.register(dto);
    return {
      message: '注册成功',
    };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<ILoginResponse, 'refreshToken'>> {
    const ip = req.ip;
    const result = await this.authService.login(dto, ip);

    // 将refreshToken设置为HttpOnly Cookie
    this.setRefreshTokenCookie(res, result.refreshToken);

    // 返回结果中不包含refreshToken
    const { refreshToken: _refreshToken, ...restResult } = result;
    return restResult;
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) _res: Response,
  ): Promise<Omit<ILoginResponse, 'refreshToken'>> {
    // 从cookie中获取refreshToken
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new Error('未找到刷新令牌');
    }

    const result = await this.authService.refreshAccessToken(refreshToken);

    return result;
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    // 清除refreshToken cookie
    res.clearCookie('refresh_token');

    return {
      message: '退出登录成功',
    };
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    // 设置HttpOnly Cookie，有效期与refreshToken相同
    res.cookie('refresh_token', token, {
      httpOnly: true, // 防止客户端JavaScript访问
      secure: process.env.NODE_ENV === 'production', // 在生产环境中只通过HTTPS发送
      sameSite: 'strict', // 防止CSRF攻击
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7天，与refreshToken过期时间一致
      path: '/nest/api/auth', // 只在auth相关接口中可用,
    });
  }
}
