// import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {  IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password', 'username'] as const) {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastLoginIp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  lastLoginTime?: Date;
}
