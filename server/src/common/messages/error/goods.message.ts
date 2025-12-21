import { Language } from '../../enums/language.enum';

type GoodsErrorType = {
  DUPLICATE_TAG: string;
  NOT_FOUND: string;
};

export const GoodsErrorMessage: Record<Language, GoodsErrorType> = {
  [Language.UK]: {
    DUPLICATE_TAG: 'Товар з таким тегом вже існує',
    NOT_FOUND: 'Товар не знайдено',
  },
  [Language.RU]: {
    DUPLICATE_TAG: 'Товар с таким тегом уже существует',
    NOT_FOUND: 'Товар не найден',
  },
};
