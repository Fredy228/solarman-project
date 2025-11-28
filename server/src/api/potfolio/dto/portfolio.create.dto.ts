import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

JoiSchemaOptions({
  allowUnknown: false,
});
export class PortfolioCreateDto {
  @JoiSchema(
    Joi.string().trim().min(2).max(250).required().messages({
      'string.empty': "Назва є обов'язковим полем",
      'any.required': "Назва є обов'язковим полем",
      'string.min': 'Назва повинна містити щонайменше 2 символи',
      'string.max': 'Назва не може перевищувати 250 символів',
    }),
  )
  title: string;

  @JoiSchema(
    Joi.string().trim().min(5).max(300).required().messages({
      'string.empty': "Тег є обов'язковим полем",
      'any.required': "Тег є обов'язковим полем",
      'string.min': 'Тег повинен містити щонайменше 5 символів',
      'string.max': 'Тег не може перевищувати 300 символів',
    }),
  )
  tag: string;

  @JoiSchema(
    Joi.string().trim().min(5).max(5000).required().messages({
      'string.empty': "Опис є обов'язковим полем",
      'any.required': "Опис є обов'язковим полем",
      'string.min': 'Опис повинен містити щонайменше 5 символів',
      'string.max': 'Опис не може перевищувати 5000 символів',
    }),
  )
  description: string;
}
