import { Sequelize } from "sequelize-typescript";
import { Category } from "#category/domain";
import { CategorySequelizeRepository } from './category-repository';
import { CategoryModel } from "./category-model";

describe('Category sequelize repository integration test', () => {
  let sequelize: Sequelize;
  let repository: CategorySequelizeRepository;

  beforeAll(() => 
    sequelize = new Sequelize({
      dialect: 'sqlite',
      host: ':memory:',
      logging: true,
      models: [CategoryModel],
    })
  );

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
    await sequelize.sync({
      force: true,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should inserts a new entity', async () => {
    let category = new Category({
      name: 'movie'
    });

    await repository.insert(category);

    let model = await CategoryModel.findByPk(category.id);

    expect(model.toJSON()).toStrictEqual(category.toJSON());

    category = new Category({
      name: 'movie',
      description: 'some description',
      is_active: false
    });

    await repository.insert(category);

    model = await CategoryModel.findByPk(category.id);

    expect(model.toJSON()).toStrictEqual(category.toJSON());
  });
});