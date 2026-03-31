import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GOOGLE_PLACES_API_NEW_BASE_URL } from '../../../configs/external-api-routes.config';
import { GoogleReviewsApiService } from './google-reviews-api.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: GOOGLE_PLACES_API_NEW_BASE_URL,
    }),
  ],
  providers: [GoogleReviewsApiService],
  exports: [GoogleReviewsApiService],
})
export class GoogleReviewsApiModule {}
