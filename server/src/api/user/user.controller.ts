import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Role, type User } from '@prisma/client';
import type { Response } from 'express';
import { CustomHttpExceptionUtil } from '../../helpers/custom-http-exection.util';

import { JoiPipe } from 'nestjs-joi';
import type { ProtectReqType } from 'src/common/types/request.type';
import { Roles } from '../../common/decorator/roles.decorator';
import { RolesGuard } from '../../common/guard/roles.guard';
import { TUserPublic } from '../../common/types/user.type';
import { RegisterDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGetManyQueryDto } from './dto/user-get-many.query.dto';
import { UserService } from './user.service';

@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async create(@Body(JoiPipe) body: RegisterDto): Promise<TUserPublic> {
    return this.userService.create(body);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async getAll(
    @Query(JoiPipe) query: UserGetManyQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, total } = await this.userService.getAll(query);
    res.header('X-Total-Count', total.toString());
    return data;
  }

  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async getById(@Param('userId') userId: string) {
    return this.userService.findUserById(userId);
  }

  @Patch('/:userId')
  @HttpCode(HttpStatus.OK)
  @Roles()
  async updateUser(
    @Param('userId') userId: string,
    @Body(JoiPipe) body: UpdateUserDto,
    @Req() req: ProtectReqType,
  ): Promise<User> {
    if (
      req.user?.id !== userId &&
      ![Role.ADMIN, Role.TECHNICIAN].includes(req.user?.role as any)
    ) {
      throw new CustomHttpExceptionUtil(
        HttpStatus.FORBIDDEN,
        'You are not authorized to update this user',
      );
    }
    return this.userService.updateUser(userId, body);
  }

  @Delete('/:userId')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async deleteById(@Param('userId') userId: string) {
    return this.userService.deleteById(userId);
  }
}
