import { Language } from '../../enums/language.enum';

type GoodsBrandErrorType = {
  DUPLICATE_NAME: string;
  NOT_FOUND: string;
};

export const GoodsBrandErrorMessage: Record<Language, GoodsBrandErrorType> = {
  [Language.UK]: {
    DUPLICATE_NAME: 'Такий бренд вже існує',
    NOT_FOUND: 'Бренд не знайдено',
  },
  [Language.RU]: {
    DUPLICATE_NAME: 'Такой бренд уже существует',
    NOT_FOUND: 'Бренд не найден',
  },
};
