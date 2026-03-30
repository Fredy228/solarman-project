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
  error_message?: string;
  result?: {
    name?: string;
    reviews?: TReview[];
  };
  status: string;
};
