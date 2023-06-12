import joi from 'joi';
import { CONFIG_DB_SCHEMA } from '../config.module';

describe('Schema unit tests', () => {
  describe('DB schema', () => {
    const schema = joi.object({
      ...CONFIG_DB_SCHEMA,
    });

    describe('DB_VENDOR', () => {
      test('Invalid cases - required', () => {
        expect(schema.validate({}).error.message).toContain(
          '"DB_VENDOR" is required',
        );
      });

      test('Invalid cases - mysql | sqlite', () => {
        expect(schema.validate({ DB_VENDOR: 5 }).error.message).toContain(
          '"DB_VENDOR" must be one of [mysql, sqlite]',
        );
      });
    });
  });
});
