import { Chance } from "chance";

import { UniqueEntityId } from "#seedwork/domain";
import { CategoryFakeBuilder } from "../category-fake-builder";
import { Category } from "../category";

describe('CategoryFajerBuild unit tests', () => {
  describe('unique_entity_id prop', () => {
    const faker = CategoryFakeBuilder.aCategory();

    it('should be undefined', () => {
      expect(faker['unique_entity_id']).toBeUndefined();
    });

    test('withUniqueEntityId', () => {
      const uniqueEntityId = new UniqueEntityId();
      const $this = faker.withUniqueEntityId(uniqueEntityId);

      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['unique_entity_id']).toBe(uniqueEntityId);

      faker.withUniqueEntityId(() => uniqueEntityId);
      expect(faker['unique_entity_id']()).toBe(uniqueEntityId);
    });

    it('should pass index to unique_entity_id factory', () => {
      let mockFactory = jest.fn().mockReturnValue(new UniqueEntityId);
      faker.withUniqueEntityId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledWith(0);

      mockFactory = jest.fn().mockReturnValue(new UniqueEntityId);
      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withUniqueEntityId(mockFactory);
      fakerMany.build();
      expect(mockFactory).toHaveBeenCalledWith(0);
      expect(mockFactory).toHaveBeenCalledWith(1);
    });
  });

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

  describe('created_at prop', () => {
    const faker = CategoryFakeBuilder.aCategory();

    it('should be undefined', () => {
      expect(faker['created_at']).toBeUndefined();
    });

    test('withCreatedAt', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['created_at']).toBe(date);

      faker.withCreatedAt(() => date);
      expect(faker['created_at']()).toBe(date);
    });

    it('should pass index to created_at factory', () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const category = faker.build();
      expect(category.created_at.getTime()).toBe(date.getTime() + 2);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const categories = fakerMany.build();

      expect(categories[0].created_at.getTime()).toBe(date.getTime() + 2);
      expect(categories[1].created_at.getTime()).toBe(date.getTime() + 1 + 2);
    });
  });
});
