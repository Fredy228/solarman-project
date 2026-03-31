export const GOOGLE_PLACES_API_NEW_BASE_URL =
  'https://places.googleapis.com/v1';

export const externalApiRoutes = {
  googlePlace: {
    reviews: (placeId: string) => `/places/${encodeURIComponent(placeId)}`,
    reviewsFieldMask: 'reviews',
  },
  keyCrm: {
    lead: '/v1/pipelines/cards',
  },
};
