import { Category } from '@core/micro-videos/category/domain';

export class CategoryFixture {
  static keysInCategoriesResponse() {
    return ['id', 'name', 'description', 'is_active', 'created_at'];
  }

  static arrangeForSave() {
    const faker = Category.fake()
      .aCategory()
      .withName('Movie')
      .withDescription('Some description');
    return [
      {
        send_data: {
          name: faker.name,
        },
        expected: {
          description: null,
          is_active: true,
        },
      },
      {
        send_data: {
          name: faker.name,
          description: null,
        },
        expected: {
          is_active: true,
        },
      },
      {
        send_data: {
          name: faker.name,
          is_active: true,
        },
        expected: {
          description: null,
        },
      },
      {
        send_data: {
          name: faker.name,
          description: faker.description,
          is_active: true,
        },
        expected: {},
      },
      {
        send_data: {
          name: faker.name,
          description: faker.description,
          is_active: false,
        },
        expected: {},
      },
    ];
  }

  static arrangeForEntityValidationError() {
    const faker = Category.fake().aCategory();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };
    return {
      BODY_EMPTY: {
        send_data: {},
        expected: {
          message: [
            'name must be shorter than or equal to 255 characters',
            'name must be a string',
            'name should not be empty',
          ],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        send_data: {
          name: faker.withInvalidName(undefined).name,
        },
        expected: {
          message: [
            'name must be shorter than or equal to 255 characters',
            'name must be a string',
            'name should not be empty',
          ],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        send_data: {
          name: faker.withInvalidName(null).name,
        },
        expected: {
          message: [
            'name must be shorter than or equal to 255 characters',
            'name must be a string',
            'name should not be empty',
          ],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        send_data: {
          name: faker.withInvalidName('').name,
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      DESCRIPTION_NOT_A_STRING: {
        send_data: {
          description: faker.withInvalidDescriptionNotAString().description,
        },
        expected: {
          message: [
            'name must be shorter than or equal to 255 characters',
            'name must be a string',
            'name should not be empty',
            'description must be a string',
          ],
          ...defaultExpected,
        },
      },
      IS_ACTIVE_NOT_A_BOOLEAN: {
        send_data: {
          is_active: faker.withInvalidIsActiveNotABoolean().is_active,
        },
        expected: {
          message: [
            'name must be shorter than or equal to 255 characters',
            'name must be a string',
            'name should not be empty',
            'is_active must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeInvalidRequest() {
    const faker = Category.fake().aCategory();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };
    return {
      BODY_EMPTY: {
        send_data: {},
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        send_data: {
          name: faker.withInvalidName(undefined).name,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        send_data: {
          name: faker.withInvalidName(null).name,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        send_data: {
          name: faker.withInvalidName('').name,
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      DESCRIPTION_NOT_A_STRING: {
        send_data: {
          description: faker.withInvalidDescriptionNotAString().description,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'description must be a string',
          ],
          ...defaultExpected,
        },
      },
      IS_ACTIVE_NOT_A_BOOLEAN: {
        send_data: {
          is_active: faker.withInvalidIsActiveNotABoolean().is_active,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'is_active must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
    };
  }
}

export class CreateCategoryFixture {
  static keysInCategoriesResponse() {
    return CategoryFixture.keysInCategoriesResponse();
  }

  static arrangeForSave() {
    return CategoryFixture.arrangeForSave();
  }

  static arrangeForEntityValidationError() {
    return CategoryFixture.arrangeForEntityValidationError();
  }

  static arrangeInvalidRequest() {
    return CategoryFixture.arrangeInvalidRequest();
  }
}

export class UpdateCategoryFixture {
  static keysInCategoriesResponse() {
    return CategoryFixture.keysInCategoriesResponse();
  }

  static arrangeForSave() {
    return CategoryFixture.arrangeForSave();
  }

  static arrangeInvalidRequest() {
    return CategoryFixture.arrangeInvalidRequest();
  }

  static arrangeForEntityValidationError() {
    const { IS_ACTIVE_NOT_A_BOOLEAN, ...keys } =
      CategoryFixture.arrangeForEntityValidationError();

    return keys;
  }
}
