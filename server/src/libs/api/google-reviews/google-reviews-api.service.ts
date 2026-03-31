import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse, isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Language } from '../../../common/enums/language.enum';
import { externalApiRoutes } from '../../../configs/external-api-routes.config';
import {
  TGooglePlaceReview,
  TGooglePlaceReviewsResponse,
  TReview,
} from './types/review.type';

@Injectable()
export class GoogleReviewsApiService {
  private logger = new Logger(GoogleReviewsApiService.name);

  private readonly token: string | null;
  private readonly placeId: string | null;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.token =
      this.configService.get<string>('TOKEN_GOOGLE_PLACE_API') || null;
    this.placeId = this.configService.get<string>('GOOGLE_PLACE_ID') || null;
  }

  async getReviews(lang: Language): Promise<TReview[] | null> {
    const { token, placeId } = this;

    if (!token || !placeId) {
      this.logger.warn(
        'Skipping Google Places API (New) call due to missing configuration',
      );
      return null;
    }

    try {
      const response: AxiosResponse<TGooglePlaceReviewsResponse> =
        await firstValueFrom(
          this.httpService.get<TGooglePlaceReviewsResponse>(
            externalApiRoutes.googlePlace.reviews(placeId),
            {
              headers: {
                'X-Goog-Api-Key': token,
                'X-Goog-FieldMask':
                  externalApiRoutes.googlePlace.reviewsFieldMask,
              },
              params: {
                languageCode: lang,
              },
            },
          ),
        );
      const googlePlaceReviews: TGooglePlaceReview[] =
        response.data.reviews ?? [];
      const reviews: TReview[] = googlePlaceReviews.map(
        (review: TGooglePlaceReview) => this.mapGooglePlaceReview(review),
      );

      this.logger.log(
        `Fetched ${reviews.length} reviews from Google Places API (New) for language "${lang}"`,
      );
      return reviews;
    } catch (e) {
      if (isAxiosError(e)) {
        const status = e.response?.status
          ? `HTTP ${e.response.status}`
          : 'no HTTP status';
        this.logger.error(
          `Google Places API (New) request failed: ${status}, ${e.message}, Response data: ${JSON.stringify(e.response?.data)}`,
        );
      } else {
        this.logger.error(`Unexpected Google Places API (New) error: ${e}`);
      }
      return null;
    }
  }

  private mapGooglePlaceReview(review: TGooglePlaceReview): TReview {
    const localizedText = review.text?.text ?? review.originalText?.text ?? '';
    const localizedLanguage =
      review.text?.languageCode ?? review.originalText?.languageCode ?? '';
    const publishTime = review.publishTime
      ? Date.parse(review.publishTime)
      : NaN;

    return {
      author_name: review.authorAttribution?.displayName ?? '',
      author_url: review.authorAttribution?.uri ?? '',
      language: localizedLanguage,
      profile_photo_url: review.authorAttribution?.photoUri ?? '',
      rating: review.rating ?? 0,
      relative_time_description: review.relativePublishTimeDescription ?? '',
      text: localizedText,
      time: Number.isNaN(publishTime) ? 0 : Math.floor(publishTime / 1000),
      translated: this.isTranslatedReview(review),
    };
  }

  private isTranslatedReview(review: TGooglePlaceReview): boolean {
    const localizedText = review.text?.text;
    const originalText = review.originalText?.text;
    const localizedLanguage = review.text?.languageCode;
    const originalLanguage = review.originalText?.languageCode;

    if (!review.originalText) {
      return false;
    }

    if (
      localizedLanguage &&
      originalLanguage &&
      localizedLanguage !== originalLanguage
    ) {
      return true;
    }

    if (
      !localizedLanguage &&
      !originalLanguage &&
      localizedText &&
      originalText
    ) {
      return (
        this.normalizeReviewText(localizedText) !==
        this.normalizeReviewText(originalText)
      );
    }

    return false;
  }

  private normalizeReviewText(text: string): string {
    return text.normalize('NFC').replace(/\s+/g, ' ').trim();
  }
}
