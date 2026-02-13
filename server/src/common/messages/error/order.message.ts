import { Language } from '../../enums/language.enum';

type OrderErrorType = {
  NOT_FOUND: string;
};

export const OrderErrorMessage: Record<Language, OrderErrorType> = {
  [Language.UK]: {
    NOT_FOUND: 'Заявка не знайдена',
  },
  [Language.RU]: {
    NOT_FOUND: 'Заявка не найдена',
  },
};
