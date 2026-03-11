import { Language } from '../../enums/language.enum';

type BlogErrorType = {
  NOT_FOUND: string;
  ALREADY_EXIST: string;
};

export const BlogErrorMessage: Record<Language, BlogErrorType> = {
  [Language.UK]: {
    NOT_FOUND: 'Стаття не знайдена',
    ALREADY_EXIST: 'Стаття вже існує',
  },
  [Language.RU]: {
    NOT_FOUND: 'Статья не найдена',
    ALREADY_EXIST: 'Статья уже существует',
  },
};
