import { IRole } from 'src/common/interfaces/role.interface';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  ParseIntPipe,
  Param,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { User } from 'src/common/decorators/user/user.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  IPaginatedResponse,
  IResponse,
} from 'src/common/interfaces/response.interface';
import { FindPagenationRoleDto } from './dto/find-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: '创建角色' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Body() body: CreateRoleDto,
    @User() user: any,
  ): Promise<IResponse<void>> {
    await this.roleService.createRole(body, user);
    return {
      message: '创建成功',
    };
  }

  @ApiOperation({ summary: '更新角色' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('update')
  async update(
    @Body() body: UpdateRoleDto,
    @User() user: any,
  ): Promise<IResponse<void>> {
    await this.roleService.updateRole(body.id, body, user);
    return {
      message: '修改成功',
    };
  }

  @ApiOperation({ summary: '查找单个角色' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('find/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<IRole | {}> {
    return await this.roleService.getRoleById(id);
  }

  @ApiOperation({ summary: '查找所有角色列表' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('find/all/count/list')
  async findAllCountList(
    @Query() query: FindPagenationRoleDto,
  ): Promise<IPaginatedResponse<IRole>> {
    return await this.roleService.getAllAndCountRoles(query);
  }

  @ApiOperation({ summary: '删除角色' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<void>> {
    await this.roleService.deleteRole(id);
    return {
      message: '删除成功',
    };
  }
}
