import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { Type } from "class-transformer";

export class FindUserDto extends OmitType(CreateUserDto,['password','avatar', 'username']) {
    @ApiPropertyOptional({
        description: '用户名',
    })
    @IsString()
    @IsOptional()
    username?: string;
}


export class FindUserPageDto extends FindUserDto {
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