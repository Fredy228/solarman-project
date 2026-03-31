import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GoogleReviewsApiService } from '../../libs/api/google-reviews/google-reviews-api.service';
import { TReview } from '../../libs/api/google-reviews/types/review.type';
import { Language } from '../../common/enums/language.enum';

@Injectable()
export class ReviewsService implements OnModuleInit {
  private readonly logger = new Logger(ReviewsService.name);

  private cachedReviews: Partial<Record<Language, TReview[]>> = {};
  private cacheUpdatedAt: Partial<Record<Language, Date>> = {};
  private refreshPromises: Partial<Record<Language, Promise<TReview[]>>> = {};

  constructor(
    private readonly googleReviewsApiService: GoogleReviewsApiService,
  ) {}

  async onModuleInit() {
    await this.refreshAllReviewsCaches();
  }

  async getReviews(lang: Language): Promise<TReview[]> {
    if (this.cacheUpdatedAt[lang]) {
      return this.cachedReviews[lang] ?? [];
    }

    return this.refreshReviewsCache(lang);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async refreshReviewsCacheByCron() {
    await this.refreshAllReviewsCaches();
  }

  async refreshReviewsCache(lang: Language): Promise<TReview[]> {
    if (this.refreshPromises[lang]) {
      return this.refreshPromises[lang];
    }

    this.refreshPromises[lang] = this.fetchAndCacheReviews(lang);

    try {
      return await this.refreshPromises[lang];
    } finally {
      delete this.refreshPromises[lang];
    }
  }

  private async refreshAllReviewsCaches(): Promise<void> {
    await Promise.all(
      Object.values(Language).map((lang) => this.refreshReviewsCache(lang)),
    );
  }

  private async fetchAndCacheReviews(lang: Language): Promise<TReview[]> {
    const reviews: TReview[] | null =
      await this.googleReviewsApiService.getReviews(lang);

    if (reviews === null) {
      if (this.cacheUpdatedAt[lang]) {
        this.logger.warn(
          `Failed to refresh Google reviews cache for language "${lang}", returning stale cached reviews`,
        );
        return this.cachedReviews[lang] ?? [];
      }

      this.logger.warn(
        `Failed to fetch Google reviews for language "${lang}" and cache is still empty`,
      );
      return [];
    }

    this.cachedReviews[lang] = reviews;
    this.cacheUpdatedAt[lang] = new Date();
    this.logger.log(
      `Google reviews cache for language "${lang}" updated at ${this.cacheUpdatedAt[lang].toISOString()}`,
    );

    return this.cachedReviews[lang] ?? [];
  }
}
