import { Sequelize } from "sequelize-typescript";
import { Category } from "#category/domain";
import { CategorySequelizeRepository } from './category-repository';
import { CategoryModel } from "./category-model";
import { NotFoundError, UniqueEntityId } from "#seedwork/domain";

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

  it("should throws error when entity not found", async () => {
    await expect(repository.findById("1")).rejects.toThrow(
      new NotFoundError("Entity not found using ID 1")
    );

    await expect(
      repository.findById(
        new UniqueEntityId("e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3")
      )
    ).rejects.toThrow(
      new NotFoundError(
        "Entity not found using ID e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3"
      )
    );
  });

  it("should finds a entity by ID", async () => {
    const entity = new Category({ name: "name value"});
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should return all categories", async () => {
    const entity = new Category({ name: "name value"});
    await repository.insert(entity);

    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });
});