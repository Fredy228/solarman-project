export const generatePrismaPaginateOption = (
  _start: number,
  _end: number,
  _sort: string,
  _order: string,
) => ({
  skip: _start,
  take: _end - _start,
  orderBy: {
    [_sort]: _order.toLowerCase(),
  },
});
