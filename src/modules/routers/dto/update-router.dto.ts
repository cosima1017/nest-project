import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { CreateRouterDto } from './create-router.dto';
export class UpdateRouterDto extends PartialType(CreateRouterDto) {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  id: number;
}
