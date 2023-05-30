import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "./category-model";


describe('CategoryModel unit tests', () => {
  let sequelize: Sequelize;

  beforeAll(() => 
    sequelize = new Sequelize({
      dialect: 'sqlite',
      host: ':memory:',
      logging: true,
      models: [CategoryModel],
    })
  );

  beforeEach(async () => {
    await sequelize.sync({
      force: true,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("create", async () => {
    const arrange = {
      id: "9366b7dc-2d71-4799-b91c-c64adb205104",
      name: "test",
      is_active: true,
      created_at: new Date(),
    };
    const category = await CategoryModel.create(arrange);
    expect(category.dataValues.id).toBe(arrange.id);
    expect(category.dataValues.name).toBe(arrange.name);
    expect(category.dataValues.is_active).toBe(arrange.is_active);
    expect(category.dataValues.created_at).toBe(arrange.created_at);
  });
});