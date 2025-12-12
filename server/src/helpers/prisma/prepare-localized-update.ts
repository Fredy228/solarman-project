export const prepareLocalizedUpdate = (uk?: string, ru?: string) => {
  const updateData: { uk?: string; ru?: string } = {};

  if (uk !== undefined) updateData.uk = uk;
  if (ru !== undefined) updateData.ru = ru;

  return Object.keys(updateData).length > 0
    ? { update: updateData }
    : undefined;
};
