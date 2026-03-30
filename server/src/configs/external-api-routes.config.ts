export const externalApiRoutes = {
  googlePlace: {
    reviews: (placeId: string, apiKey: string) =>
      `/maps/api/place/details/json?place_id=${placeId}&fields=name,reviews&language=ru&key=${apiKey}`,
  },
  keyCrm: {
    lead: '/v1/pipelines/cards',
  },
};
