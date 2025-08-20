import { Body, Controller, Delete, Get, Post, Param } from '@nestjs/common';
import { RoutersService } from './routers.service';
import {
  IPaginatedResponse,
  IResponse,
} from 'src/common/interfaces/response.interface';
import { CreateRouterDto } from './dto/create-router.dto';
import { UpdateRouterDto } from './dto/update-router.dto';

@Controller('routers')
export class RoutersController {
  constructor(private readonly routersService: RoutersService) {}

  @Get('/list')
  async findAndCount(): Promise<IPaginatedResponse<any>> {
    return await this.routersService.findAndCount();
  }

  @Post('/create')
  async createRouter(@Body() router: CreateRouterDto): Promise<IResponse<any>> {
    return await this.routersService.createRouter(router);
  }

  @Post('/update')
  async updateRouter(@Body() router: UpdateRouterDto): Promise<IResponse<any>> {
    return await this.routersService.updateRouter(router);
  }

  @Delete('/delete/:id')
  async deleteRouter(@Param('id') id: number): Promise<IResponse<any>> {
    return await this.routersService.deleteRouter(id);
  }
}
