import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRouterDto {
  @ApiProperty({
    description: '菜单名称',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  parentId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  path?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  component?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  redirect?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(50)
  icon?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sort?: number;

  @ApiPropertyOptional({
    description: '是否缓存',
    example: 0,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  keepAlive?: boolean;

  @ApiPropertyOptional({
    example: 0, // 0: 否 1: 是
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  hidden?: boolean;
}
