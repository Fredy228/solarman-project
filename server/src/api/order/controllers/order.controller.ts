import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { JoiPipe } from 'nestjs-joi';
import { Lang } from 'src/common/decorator/lang.decorator';
import type { Language } from 'src/common/enums/language.enum';
import type { OrderGetManyQueryDto } from '../dto/order-get-many.query.dto';
import type { OrderUpdateDto } from '../dto/order.update.dto';
import type { OrderService } from '../services/order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/')
  @HttpCode(200)
  async getAll(
    @Query(JoiPipe) query: OrderGetManyQueryDto,
    @Res() res: Response,
  ) {
    const { data, total } = await this.orderService.getAll(query);
    res.header('X-Total-Count', total.toString());
    res.send(data);
  }

  @Get('/:id')
  @HttpCode(200)
  async getOneById(@Lang() lang: Language, @Param('id') id: string) {
    return this.orderService.getOneById(id, lang);
  }

  @Patch('/:id')
  @HttpCode(200)
  async update(
    @Lang() lang: Language,
    @Param('id') id: string,
    @Query(JoiPipe) body: OrderUpdateDto,
  ) {
    return this.orderService.update(id, body, lang);
  }

  @Delete('/:id')
  @HttpCode(204)
  async delete(@Param('id') id: string, @Lang() lang: Language) {
    await this.orderService.deleteById(id, lang);
  }
}
