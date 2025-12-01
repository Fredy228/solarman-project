import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { JoiPipe } from 'nestjs-joi';
import { type Response } from 'express';
import { PortfolioService } from '../portfolio.service';
import { PortfolioGetManyQueryDto } from '../dto/portfolio-get-many.query.dto';
import { Portfolio } from '@prisma/client';

@Controller('portfolio')
export class PortfolioPublicController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getMany(
    @Query(JoiPipe) query: PortfolioGetManyQueryDto,
    @Res() res: Response,
  ) {
    const { data, total } = await this.portfolioService.getMany(query);
    res.header('X-Total-Count', total.toString());
    res.send(data);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<Portfolio> {
    return this.portfolioService.getOne(id);
  }
}
