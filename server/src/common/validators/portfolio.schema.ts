import Joi from 'joi';

export const portfolioSchema = Joi.object({
  title: Joi.string().trim().min(2).max(250).messages({
    'string.empty': "Назва є обов'язковим полем",
    'any.required': "Назва є обов'язковим полем",
    'string.min': 'Назва повинна містити щонайменше 2 символи',
    'string.max': 'Назва не може перевищувати 250 символів',
  }),

  tag: Joi.string().trim().min(5).max(300).messages({
    'string.empty': "Тег є обов'язковим полем",
    'any.required': "Тег є обов'язковим полем",
    'string.min': 'Тег повинен містити щонайменше 5 символів',
    'string.max': 'Тег не може перевищувати 300 символів',
  }),

  date: Joi.date().messages({
    'any.required': "Дата є обов'язковим полем",
    'date.base': 'Необхідно вказати дату',
  }),

  description: Joi.string().trim().min(5).max(5000).messages({
    'string.empty': "Опис є обов'язковим полем",
    'any.required': "Опис є обов'язковим полем",
    'string.min': 'Опис повинен містити щонайменше 5 символів',
    'string.max': 'Опис не може перевищувати 5000 символів',
  }),
});
