import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { IUser } from 'src/common/interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserPageDto } from './dto/find-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { HashPassword } from 'src/common/decorators/password/password.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user/user.decorator';
import { IResponse } from 'src/common/interfaces/response.interface';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/update')
  async updateUser(
    @Body() body: UpdateUserDto,
    @User() user: any,
  ): Promise<IResponse<void>> {
    await this.UserService.updateUser(body.id, body, user);
    return {
      message: '修改成功',
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  async deleteUser(@Param('id') id: number): Promise<IResponse<void>> {
    await this.UserService.deleteUser(id);
    return {
      message: '删除成功',
    };
  }

  @Get('/list')
  async getUserList(@Query() query: FindUserPageDto): Promise<{
    rows: IUser[] | [];
    total: number;
  }> {
    return await this.UserService.findAllUsers(query);
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IUser | {}> {
    return await this.UserService.findUserById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createUser(
    @Body() @HashPassword() body: CreateUserDto,
    @User() user: any,
  ): Promise<IResponse<void>> {
    await this.UserService.createUser(body, user);
    return {
      message: '创建成功',
    };
  }
}
