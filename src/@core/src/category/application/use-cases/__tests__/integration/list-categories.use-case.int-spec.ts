import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { Category } from '#category/domain';
import { setupSequelize } from '#seedwork/infra/db/testing/helpers/db';
import { ListCategoriesUseCase } from "../../list-categories.use-case";

const { CategoryRepository, CategoryModel } = CategorySequelize;

describe('ListCategoriesUseCase integration tests', () => {
  let useCase: ListCategoriesUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new ListCategoriesUseCase.UseCase(repository);
  });

  it('should return output using empty input with categories ordered by created_at', async () => {
    const created_at = new Date();
    const faker = Category.fake().theCategories(2);

    const entities = faker
      .withName((index) => `category-${index}`)
      .withCreatedAt((index) => new Date(created_at.getTime() + 100 + index))
      .build();

    await repository.bulkInsert(entities);

    const output = await useCase.execute({});

    expect(output).toMatchObject({
      items: [...entities].reverse().map(item => item.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should returns output using pagination, sort and filter', async () => {
    const faker = Category.fake().aCategory();
    const entities = [
      faker.withName('a').build(),
      faker.withName('AAA').build(),
      faker.withName('AaA').build(),
      faker.withName('bbb').build(),
      faker.withName('c').build(),
    ];

    await repository.bulkInsert(entities);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      filter: 'a'
    });
    expect(output).toStrictEqual({
      items: [entities[1], entities[2]].map(item => item.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: 'name',
      filter: 'a'
    });
    expect(output).toStrictEqual({
      items: [entities[0]].map(item => item.toJSON()),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: 'a'
    });
    expect(output).toStrictEqual({
      items: [entities[0], entities[2]].map(item => item.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
