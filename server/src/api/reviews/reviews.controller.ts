import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Lang } from '../../common/decorator/lang.decorator';
import { Language } from '../../common/enums/language.enum';

@Controller('google/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getReviews(@Lang() lang: Language) {
    return this.reviewsService.getReviews(lang);
  }
}
