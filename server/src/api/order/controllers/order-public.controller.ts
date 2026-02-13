import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { JoiPipe } from 'nestjs-joi/internal/joi.pipe';
import type { OrderCreateDto } from '../dto/order.create.dto';
import type { OrderService } from '../services/order.service';

@Controller('order')
export class OrderPublicController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  @HttpCode(201)
  async create(@Body(JoiPipe) body: OrderCreateDto) {
    return this.orderService.create(body);
  }
}
