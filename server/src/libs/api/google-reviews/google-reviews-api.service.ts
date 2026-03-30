import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { externalApiRoutes } from '../../../configs/external-api-routes.config';
import { isAxiosError } from 'axios';
import { TGooglePlaceReviewsResponse, TReview } from './types/review.type';

@Injectable()
export class GoogleReviewsApiService {
  private logger = new Logger(GoogleReviewsApiService.name);

  private readonly baseURL: string | null;
  private readonly token: string | null;
  private readonly placeId: string | null;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseURL =
      this.configService.get<string>('URL_GOOGLE_PLACE_API') || null;
    this.token =
      this.configService.get<string>('TOKEN_GOOGLE_PLACE_API') || null;
    this.placeId = this.configService.get<string>('GOOGLE_PLACE_ID') || null;
  }

  async getReviews(): Promise<TReview[] | null> {
    const { baseURL, token, placeId } = this;

    if (!baseURL || !token || !placeId) {
      this.logger.warn(
        'Skipping Google Place API call due to missing configuration',
      );
      return null;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<TGooglePlaceReviewsResponse>(
          externalApiRoutes.googlePlace.reviews(placeId, token),
        ),
      );
      console.log(response.data);

      if (response.data.status !== 'OK') {
        this.logger.error(
          `Google Place API returned status ${response.data.status}: ${response.data.error_message ?? 'No error message'}`,
        );
        return null;
      }

      const reviews = response.data.result?.reviews ?? [];
      this.logger.log(`Fetched reviews from Google Place API: `, reviews);
      return reviews;
    } catch (e) {
      if (isAxiosError(e)) {
        this.logger.error(
          `Axios error: ${e.message}, Response data: ${JSON.stringify(e.response?.data)}`,
        );
      }
      return null;
    }
  }
}
