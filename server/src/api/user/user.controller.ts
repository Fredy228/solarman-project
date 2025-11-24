import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { RegisterDto } from './dto/register-user.dto';
import { UserService } from './user.service';
import { TUserPublic } from '../../common/types/user.type';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';

@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async create(@Body() body: RegisterDto): Promise<TUserPublic> {
    return this.userService.create(body);
  }
}
