import { Prisma } from '@prisma/client';

export const generatePrismaIntFilter = ({
  value,
  value_gte,
  value_lte,
}: {
  value?: number | string;
  value_gte?: number | string;
  value_lte?: number | string;
}): Prisma.IntFilter | undefined => {
  const intFilter: Prisma.IntFilter = {};

  if (value !== undefined && value !== null) {
    intFilter.equals = Number(value);
  }

  if (value_gte !== undefined && value_gte !== null) {
    intFilter.gte = Number(value_gte);
  }

  if (value_lte !== undefined && value_lte !== null) {
    intFilter.lte = Number(value_lte);
  }

  if (Object.keys(intFilter).length > 0) {
    return intFilter;
  }

  return undefined;
};
