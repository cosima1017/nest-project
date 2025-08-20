import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ExportHeaderDto {
  @ApiProperty({
    description: '列的key',
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: '列的表头',
  })
  @IsString()
  header: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  witch?: number;
}
