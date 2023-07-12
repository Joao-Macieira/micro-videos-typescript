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

export class ListCategoriesFixture {
  static arrangeIncrementedWithCreatedAt() {
    const _entities = Category.fake()
      .theCategories(4)
      .withName((i) => i + '')
      .withCreatedAt((i) => new Date(new Date().getTime() + i * 2000))
      .build();

    const entitiesMap = {
      first: _entities[0],
      second: _entities[1],
      third: _entities[2],
      fourth: _entities[3],
    };

    const arrange = [
      {
        send_data: {},
        expected: {
          entities: [
            entitiesMap.fourth,
            entitiesMap.third,
            entitiesMap.second,
            entitiesMap.first,
          ],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.fourth, entitiesMap.third],
          meta: {
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.second, entitiesMap.first],
          meta: {
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }

  static arrangeUnsorted() {
    const faker = Category.fake().aCategory();

    const entitiesMap = {
      a: faker.withName('a').build(),
      AAA: faker.withName('AAA').build(),
      AaA: faker.withName('AaA').build(),
      b: faker.withName('b').build(),
      c: faker.withName('c').build(),
    };

    const arrange = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: 'a',
        },
        expected: {
          entities: [entitiesMap.AAA, entitiesMap.AaA],
          meta: {
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: 'a',
        },
        expected: {
          entities: [entitiesMap.a],
          meta: {
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }
}
