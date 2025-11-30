import { Prisma } from '@prisma/client';

export const generatePrismaDateFilter = ({
  date,
  date_gte,
  date_lte,
}: {
  date?: Date;
  date_gte?: Date;
  date_lte?: Date;
}): Prisma.DateTimeFilter | undefined => {
  const dateFilter: Prisma.DateTimeFilter = {};

  if (date) {
    const gte = new Date(date);
    gte.setHours(0, 0, 0, 0);
    const lt = new Date(date);
    lt.setHours(23, 59, 59, 999);
    dateFilter.gte = gte;
    dateFilter.lt = lt;
  }

  if (date_gte) {
    const gte = new Date(date_gte);
    gte.setHours(0, 0, 0, 0);
    dateFilter.gte = gte;
  }

  if (date_lte) {
    const lte = new Date(date_lte);
    lte.setHours(23, 59, 59, 999);
    dateFilter.lte = lte;
  }

  if (Object.keys(dateFilter).length > 0) {
    return dateFilter;
  }
  return undefined;
};
