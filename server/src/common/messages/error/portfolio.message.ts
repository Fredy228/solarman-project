import { Language } from '../../enums/language.enum';

type PortfolioErrorType = {
  NOT_FOUND: string;
};

export const PortfolioErrorMessage: Record<Language, PortfolioErrorType> = {
  [Language.UK]: {
    NOT_FOUND: 'Портфоліо не знайдено',
  },
  [Language.RU]: {
    NOT_FOUND: 'Портфолио не найдено',
  },
};
