import { CustomHelpers, Schema } from 'joi';

export const joiJsonCheck = <T>(schema: Schema<T>) => {
  return (value: unknown, helpers: CustomHelpers) => {
    let parsedValue = value;

    if (typeof value === 'string') {
      try {
        parsedValue = JSON.parse(value);
      } catch {
        return helpers.message({ custom: 'Invalid JSON string format' });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { error, value: validated } = schema.validate(parsedValue, {
      convert: true,
      stripUnknown: true,
    });

    if (error) {
      return helpers.message({ custom: error.details[0].message });
    }

    return validated;
  };
};
