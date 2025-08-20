import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsPhoneNumber,
  IsEmail,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: '密码',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(16, {
    message: '密码长度不能超过16位',
  })
  password: string;

  @ApiPropertyOptional({
    description: '昵称',
  })
  @IsString()
  @IsOptional()
  @MaxLength(16, {
    message: '昵称长度不能超过16位',
  })
  nickname?: string;

  @ApiPropertyOptional({
    description: '邮箱',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: '手机号',
  })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: '头像',
  })
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({
    description: '角色',
  })
  @IsOptional()
  @IsArray()
  roleIds?: number[];
}
