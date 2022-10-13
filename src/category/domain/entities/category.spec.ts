import { Category } from "./category";

describe("Category Unit Tests", () => {
  test("category constructor", () => {
    const category = new Category("Movie");

    expect(category.name).toEqual("Movie");
  });
});