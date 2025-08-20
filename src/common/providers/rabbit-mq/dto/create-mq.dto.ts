import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateMqDto {
  @IsNotEmpty()
  @IsString()
  pattern: string;

  @IsNotEmpty()
  @IsObject()
  data: any;

  @IsOptional()
  @IsString()
  mqId?: string;
}
