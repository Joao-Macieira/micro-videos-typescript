import { CategoryFakeBuilder } from "#category/domain/entities/category-fake-builder";
import CategoryInMemoryRepository from "./category-in-memory.repository";

describe('CategoryInMemoryRepository', () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
  });

  it('should no filter items when object is null', async () => {
    const items = [
      CategoryFakeBuilder.aCategory().build(),
    ];
    const spyFilter = jest.spyOn(items, 'filter');

    const filteredItems = await repository['applyFilter'](items, null);
    expect(spyFilter).not.toHaveBeenCalled();
    expect(filteredItems).toStrictEqual(items);
  });

  it('should filter items using filter parameter', async () => {
    const faker = CategoryFakeBuilder.aCategory();
    const items = [
      faker.withName('Jhon').build(),
      faker.withName('JHON').build(),
      faker.withName('fake').build(),
    ];
    const spyFilter = jest.spyOn(items, 'filter');

    const filteredItems = await repository['applyFilter'](items, 'JHON');
    expect(spyFilter).toHaveBeenCalled();
    expect(filteredItems).toStrictEqual([items[0], items[1]]);
  });

  it('should sort by created_at when sort param is null', async () => {
    const created_at = new Date();
    const faker = CategoryFakeBuilder.aCategory();
    const items = [
      faker.withName('Jhon').withCreatedAt(created_at).build(),
      faker.withName('JHON').withCreatedAt(new Date(created_at.getTime() + 100)).build(),
      faker.withName('fake').withCreatedAt(new Date(created_at.getTime() + 200)).build(),
    ];

    const sortedItems = await repository['applySort'](items, null, null);
    expect(sortedItems).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name', async () => {
    const faker = CategoryFakeBuilder.aCategory();
    const items = [
      faker.withName('e').build(),
      faker.withName('c').build(),
      faker.withName('a').build(),
      faker.withName('b').build(),
      faker.withName('d').build(),
    ];

    let sortedItems = await repository['applySort'](items, 'name', 'asc');
    expect(sortedItems).toStrictEqual([items[2], items[3], items[1], items[4], items[0]]);

    sortedItems = await repository['applySort'](items, 'name', 'desc');
    expect(sortedItems).toStrictEqual([items[0], items[4], items[1], items[3], items[2]]);
  });
})