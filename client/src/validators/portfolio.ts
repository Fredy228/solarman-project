import Joi from "joi";

export const portfolioSchema = Joi.object({
  cover: Joi.object()
    .instance(File)
    .required()
    .messages({
      "any.required": "Головна фотографія є обов'язковою",
      "object.base": "Необхідно завантажити файл",
    }),

  title: Joi.string().trim().min(2).max(250).required().messages({
    "string.empty": "Назва є обов'язковим полем",
    "any.required": "Назва є обов'язковим полем",
    "string.min": "Назва повинна містити щонайменше 2 символи",
    "string.max": "Назва не може перевищувати 250 символів",
  }),

  tag: Joi.string().trim().min(5).max(300).required().messages({
    "string.empty": "Тег є обов'язковим полем",
    "any.required": "Тег є обов'язковим полем",
    "string.min": "Тег повинен містити щонайменше 5 символів",
    "string.max": "Тег не може перевищувати 300 символів",
  }),

  date: Joi.date().required().messages({
    "any.required": "Дата є обов'язковим полем",
    "date.base": "Необхідно вказати дату",
  }),

  description: Joi.string().trim().min(5).max(5000).required().messages({
    "string.empty": "Опис є обов'язковим полем",
    "any.required": "Опис є обов'язковим полем",
    "string.min": "Опис повинен містити щонайменше 5 символів",
    "string.max": "Опис не може перевищувати 5000 символів",
  }),

  images: Joi.array()
    .items(Joi.object().instance(File))
    .max(10)
    .optional()
    .allow(null)
    .messages({
      "array.max": "Можна завантажити не більше 10 зображень",
    }),
});
