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
      const $this = faker.withName('test name');
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['name']).toBe('test name');

      faker.withName(() => 'test name');
      //@ts-expect-error name is callable
      expect(faker['name']()).toBe('test name');
    });

    it('should pass index to name factory', () => {
      const $this = faker.withName((index) => `test name ${index}`);
      
      const category = faker.build() as Category;
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(category.name).toBe('test name 0');

      const fakeMany = CategoryFakeBuilder.theCategories(2);
      fakeMany.withName((index) => `test name ${index}`);
      const categories = fakeMany.build();
      expect(categories[0].name).toBe('test name 0');
      expect(categories[1].name).toBe('test name 1');
    });

    test('invalid empty case', () => {
      const $this = faker.withInvalidName(undefined);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['name']).toBeUndefined();

      faker.withInvalidName(null);
      expect(faker['name']).toBeNull();

      faker.withInvalidName("");
      expect(faker['name']).toBe("");
    });

    test('invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['name']).toHaveLength(256);

      const tooLongName = 'a'.repeat(257);
      faker.withInvalidNameTooLong(tooLongName);
      expect(faker['name']).toHaveLength(257);
      expect(faker['name']).toBe(tooLongName);
    });

    test('invalid not a string case', () => {
      const $this = faker.withInvalidNameNotAString();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['name']).toBe(5);

      faker.withInvalidNameNotAString(10);
      expect(faker['name']).toBe(10);
    });
  });

  describe('description prop', () => {
    const faker = CategoryFakeBuilder.aCategory();

    it('should be a function', () => {
      expect(typeof faker['description'] === 'function').toBeTruthy();
    });

    it('should call paragraph method', () => {
      const chance = Chance();
      const paragraphMethod = jest.spyOn(chance, 'paragraph');

      faker['chance'] = chance;
      faker.build();

      expect(paragraphMethod).toHaveBeenCalled();
    });

    test('withDescription', () => {
      const $this = faker.withDescription('test description');
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['description']).toBe('test description');

      faker.withDescription(null);
      expect(faker['description']).toBeNull();

      faker.withDescription(() => 'test description');
      //@ts-expect-error description is callable
      expect(faker['description']()).toBe('test description');
    });

    it('should pass index to name factory', () => {
      const $this = faker.withDescription((index) => `test description ${index}`);
      
      const category = faker.build() as Category;
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(category.description).toBe('test description 0');

      const fakeMany = CategoryFakeBuilder.theCategories(2);
      fakeMany.withDescription((index) => `test description ${index}`);
      const categories = fakeMany.build();
      expect(categories[0].description).toBe('test description 0');
      expect(categories[1].description).toBe('test description 1');
    });

    test('invalid not a string case', () => {
      const $this = faker.withInvalidDescriptionNotAString();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['description']).toBe(5);

      faker.withInvalidDescriptionNotAString(11);
      expect(faker['description']).toBe(11);
    });
  });

  describe('is_active prop', () => {
    const faker = CategoryFakeBuilder.aCategory();

    it('should be a function', () => {
      expect(typeof faker['is_active'] === 'function').toBeTruthy();
    });

    it('shoud be true', () => {
      expect(faker['is_active']).toBeTruthy();
    });

    test('activate', () => {
      const $this = faker.active();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['is_active']).toBeTruthy();
    });

    test('deactivate', () => {
      const $this = faker.deactive();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['is_active']).toBeFalsy();
    });

    test('invalid empty case', () => {
      const $this = faker.withInvalidIsActiveEmpty(undefined);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['is_active']).toBeUndefined();

      faker.withInvalidIsActiveEmpty(null);
      expect(faker['is_active']).toBeNull();

      faker.withInvalidIsActiveEmpty("");
      expect(faker['is_active']).toBe("");
    });

    test('invalid not a boolean case', () => {
      const $this = faker.withInvalidIsActiveNotABoolean();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['is_active']).toBe('fake boolean');

      faker.withInvalidIsActiveNotABoolean(7);
      expect(faker['is_active']).toBe(7);
    });
  });
});
