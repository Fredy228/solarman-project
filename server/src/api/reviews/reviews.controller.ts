import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('google/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getReviews() {
    return this.reviewsService.getReviews();
  }
}
