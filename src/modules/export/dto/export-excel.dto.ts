import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ExportHeaderDto } from './export-header.dto';

export class ExportExcelDto<T = any> {
  @ApiProperty({
    description: '表头配置',
    type: [ExportHeaderDto],
    example: [
      {
        key: 'name',
        header: '姓名',
        width: 20,
      },
      {
        key: 'age',
        header: '年龄',
        width: 20,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExportHeaderDto)
  headers: ExportHeaderDto[];

  @ApiProperty({
    description: '数据',
    type: 'array',
    example: [
      {
        name: '张三',
        age: 20,
      },
      {
        name: '李四',
        age: 21,
      },
    ],
  })
  @IsArray()
  data: T[];

  @ApiProperty({
    description: '文件名',
    example: '导出数据',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiPropertyOptional({
    description: 'sheet名',
    example: 'sheet1',
  })
  @IsString()
  @IsOptional()
  sheetName?: string;
}
