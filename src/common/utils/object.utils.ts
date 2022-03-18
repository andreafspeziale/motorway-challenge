export const isKeyValueObject = (value: unknown): boolean =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  !(value instanceof Date) &&
  !(value instanceof RegExp) &&
  !(value instanceof String) &&
  !(value instanceof Number) &&
  !(value instanceof Boolean);
