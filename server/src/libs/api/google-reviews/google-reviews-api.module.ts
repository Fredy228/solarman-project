import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleReviewsApiService } from './google-reviews-api.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>('URL_GOOGLE_PLACE_API'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [GoogleReviewsApiService],
  exports: [GoogleReviewsApiService],
})
export class GoogleReviewsApiModule {}
