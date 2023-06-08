import { setupSequelize } from "#seedwork/infra/db/testing/helpers/db";
import { CategorySequelize } from "./category-sequelize";

const { CategoryModel } = CategorySequelize;

describe('CategoryModel unit tests', () => {
  setupSequelize({
    models: [CategoryModel]
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
