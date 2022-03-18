import { isKeyValueObject } from '../object.utils';

describe('Object utils', () => {
  describe('isKeyValueObject(value)', () => {
    it('should return true when it receives a plain object', () => {
      const object = {
        key: 'value',
      };

      expect(isKeyValueObject(object)).toBe(true);
      expect(isKeyValueObject(new Object(object))).toBe(true);
    });

    it('should return true when it receives a custom class instance', () => {
      class Person {
        constructor(name: string) {
          this.name = name;
        }

        name: string;
      }

      const person = new Person('John Doe');

      expect(isKeyValueObject(person)).toBe(true);
    });

    it('should return false when it receives null', () => {
      expect(isKeyValueObject(null)).toBe(false);
    });

    it('should return false when it receives an array', () => {
      const array = [0, 1, 1, 2, 3, 5, 8, 13, 21];

      expect(isKeyValueObject(array)).toBe(false);
      expect(isKeyValueObject(new Array(array))).toBe(false);
    });

    it('should return false when it receives a date', () => {
      const date = new Date();

      expect(isKeyValueObject(date)).toBe(false);
    });

    it('should return false when it receives a regular expression', () => {
      const regex = /regex/;

      expect(isKeyValueObject(regex)).toBe(false);
      expect(isKeyValueObject(new RegExp(regex))).toBe(false);
    });

    it('should return false when it receives a string', () => {
      const string = 'string';

      expect(isKeyValueObject(string)).toBe(false);
      expect(isKeyValueObject(new String(string))).toBe(false);
    });

    it('should return false when it receives a number', () => {
      const number = 42;

      expect(isKeyValueObject(number)).toBe(false);
      expect(isKeyValueObject(new Number(number))).toBe(false);
    });

    it('should return false when it receives a boolean', () => {
      const boolean = true;

      expect(isKeyValueObject(boolean)).toBe(false);
      expect(isKeyValueObject(new Boolean(boolean))).toBe(false);
    });
  });
});
