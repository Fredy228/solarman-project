import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { JoiPipe } from 'nestjs-joi/internal/joi.pipe';
import { Lang } from 'src/common/decorator/lang.decorator';
import { Language } from 'src/common/enums/language.enum';
import { OrderCreateDto } from '../dto/order.create.dto';
import { OrderService } from '../services/order.service';

@Controller('order/public')
export class OrderPublicController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  @HttpCode(201)
  async create(@Body(JoiPipe) body: OrderCreateDto, @Lang() lang: Language) {
    return this.orderService.createPublic(body, lang);
  }
}
