import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';
export class RegisterDto {
  @ApiProperty({
    description: '用户名',
    example: 'admin',
  })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @IsString({
    message: '用户名必须为字符串',
  })
  username: string;

  @ApiPropertyOptional({
    description: '昵称',
  })
  @IsString()
  @MaxLength(16, {
    message: '昵称长度不能超过16位',
  })
  @IsOptional()
  nickname?: string;

  @ApiProperty({
    description: '密码',
  })
  @IsNotEmpty({
    message: '密码不能为空',
  })
  @IsString({
    message: '密码必须为字符串',
  })
  @MaxLength(16, {
    message: '密码长度不能超过16位',
  })
  password: string;

  @ApiPropertyOptional({
    description: '手机号',
  })
  @IsString()
  @IsPhoneNumber('CN', {
    message: '手机号格式不正确',
  })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: '邮箱',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
