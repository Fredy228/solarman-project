import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { GoogleReviewsApiModule } from '../../libs/api/google-reviews/google-reviews-api.module';

@Module({
  imports: [GoogleReviewsApiModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
