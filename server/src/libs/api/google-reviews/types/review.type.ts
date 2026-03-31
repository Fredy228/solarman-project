export type TReview = {
  author_name: string;
  author_url: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated: boolean;
};

export type TGooglePlaceReviewsResponse = {
  reviews?: TGooglePlaceReview[];
};

export type TGooglePlaceReview = {
  authorAttribution?: TGooglePlaceReviewAuthorAttribution;
  originalText?: TGooglePlaceLocalizedText;
  publishTime?: string;
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: TGooglePlaceLocalizedText;
};

type TGooglePlaceReviewAuthorAttribution = {
  displayName?: string;
  photoUri?: string;
  uri?: string;
};

type TGooglePlaceLocalizedText = {
  languageCode?: string;
  text?: string;
};
