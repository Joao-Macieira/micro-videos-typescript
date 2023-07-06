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
}
