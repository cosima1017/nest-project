import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FindRoleDto extends PartialType(CreateRoleDto) {}

export class FindPagenationRoleDto extends FindRoleDto {
  @ApiProperty({
    description: '页码',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @ApiProperty({
    description: '每页数量',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pageSize: number;
}
