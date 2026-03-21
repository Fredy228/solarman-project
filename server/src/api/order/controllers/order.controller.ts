import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import type { Response } from 'express';
import { JoiPipe } from 'nestjs-joi';
import { Lang } from 'src/common/decorator/lang.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Language } from 'src/common/enums/language.enum';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { OrderGetManyQueryDto } from '../dto/order-get-many.query.dto';
import { OrderCreateDto } from '../dto/order.create.dto';
import { OrderUpdateDto } from '../dto/order.update.dto';
import { OrderService } from '../services/order.service';

@UseGuards(RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  @HttpCode(201)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async create(@Body(JoiPipe) body: OrderCreateDto, @Lang() lang: Language) {
    return this.orderService.create(body, lang);
  }

  @Get('/')
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async getAll(
    @Query(JoiPipe) query: OrderGetManyQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, total } = await this.orderService.getAll(query);
    res.header('X-Total-Count', total.toString());
    return data;
  }

  @Get('/:id')
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async getOneById(@Lang() lang: Language, @Param('id') id: string) {
    return this.orderService.getOneById(id, lang);
  }

  @Patch('/:id')
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async update(
    @Lang() lang: Language,
    @Param('id') id: string,
    @Body(JoiPipe) body: OrderUpdateDto,
  ) {
    return this.orderService.update(id, body, lang);
  }

  @Delete('/:id')
  @HttpCode(204)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async delete(@Param('id') id: string, @Lang() lang: Language) {
    await this.orderService.deleteById(id, lang);
  }
}
