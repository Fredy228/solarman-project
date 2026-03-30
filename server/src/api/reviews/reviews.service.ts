import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GoogleReviewsApiService } from '../../libs/api/google-reviews/google-reviews-api.service';
import { TReview } from '../../libs/api/google-reviews/types/review.type';

@Injectable()
export class ReviewsService implements OnModuleInit {
  private readonly logger = new Logger(ReviewsService.name);

  private cachedReviews: TReview[] = [];
  private cacheUpdatedAt: Date | null = null;
  private refreshPromise: Promise<TReview[]> | null = null;

  constructor(
    private readonly googleReviewsApiService: GoogleReviewsApiService,
  ) {}

  async onModuleInit() {
    await this.refreshReviewsCache();
  }

  async getReviews(): Promise<TReview[]> {
    if (this.cacheUpdatedAt) {
      return this.cachedReviews;
    }

    return this.refreshReviewsCache();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async refreshReviewsCacheByCron() {
    await this.refreshReviewsCache();
  }

  async refreshReviewsCache(): Promise<TReview[]> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.fetchAndCacheReviews();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async fetchAndCacheReviews(): Promise<TReview[]> {
    const reviews: TReview[] | null =
      await this.googleReviewsApiService.getReviews();

    if (reviews === null) {
      if (this.cacheUpdatedAt) {
        this.logger.warn(
          'Failed to refresh Google reviews cache, returning stale cached reviews',
        );
        return this.cachedReviews;
      }

      this.logger.warn(
        'Failed to fetch Google reviews and cache is still empty',
      );
      return [];
    }

    this.cachedReviews = reviews;
    this.cacheUpdatedAt = new Date();
    this.logger.log(
      `Google reviews cache updated at ${this.cacheUpdatedAt.toISOString()}`,
    );

    return this.cachedReviews;
  }
}
