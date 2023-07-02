import { Chance } from "chance";

import { CategoryFakeBuilder } from "../category-fake-builder";
import { Category } from "../category";

describe('CategoryFajerBuild unit tests', () => {
  describe('name prop', () => {
    let faker: CategoryFakeBuilder<Category | Category[]>;

    beforeEach(() => {
      faker = CategoryFakeBuilder.aCategory();
    });

    it('should be a function', () => {
      expect(typeof faker['name'] === 'function').toBeTruthy();
    });

    it('should call word method', () => {
      const chance = Chance();
      const wordMethod = jest.spyOn(chance, 'word');

      faker['chance'] = chance;
      faker.build();

      expect(wordMethod).toHaveBeenCalled();
    });

    test('withName', () => {
      faker.withName('test name');
      expect(faker['name']).toBe('test name');

      faker.withName(() => 'test name');
      //@ts-expect-error name is callable
      expect(faker['name']()).toBe('test name');
    });

    it('should pass index to name factory', () => {
      faker.withName((index) => `test name ${index}`);
      
      const category = faker.build() as Category;
      expect(category.name).toBe('test name 0');

      const fakeMany = CategoryFakeBuilder.theCategories(2);
      fakeMany.withName((index) => `test name ${index}`);
      const categories = fakeMany.build();
      expect(categories[0].name).toBe('test name 0');
      expect(categories[1].name).toBe('test name 1');
    });
  });
});
