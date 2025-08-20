import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, Max } from "class-validator";
import { JsonValue } from "generated/prisma/runtime/library";

export class CreateMarkerDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    title: string

    @ApiProperty({ description: '纬度，范围-90到+90，最多支持8位小数' })
    @IsNotEmpty()
    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude: number

    @ApiProperty({ description: '经度，范围-180到+180，最多支持8位小数' })
    @IsNotEmpty()
    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude: number

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(500)
    address: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(255)
    iconUrl: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(20)
    markerColor: string

    @ApiPropertyOptional()
    @IsOptional()
    // @IsJSON()
    description: JsonValue


}