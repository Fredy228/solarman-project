import { OrderType } from '@prisma/client';

export const orderTypesMap = new Map<string, string>([
  [OrderType.CONSULTATION, 'Консультація'],
  [OrderType.ORDER, 'Замовлення товару'],
  [OrderType.QUIZ, 'Квіз'],
]);
