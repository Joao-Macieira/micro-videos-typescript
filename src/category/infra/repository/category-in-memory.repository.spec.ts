import { Category } from "#category/domain/entities/category";
import CategoryInMemoryRepository from "./category-in-memory.repository";

describe('CategoryInMemoryRepository', () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
  });

  it('should no filter items when object is null', async () => {
    const items = [new Category({ name: 'Jhon' })];
    const spyFilter = jest.spyOn(items, 'filter');

    const filteredItems = await repository['applyFilter'](items, null);
    expect(spyFilter).not.toHaveBeenCalled();
    expect(filteredItems).toStrictEqual(items);
  });

  it('should filter items using filter parameter', async () => {
    const items = [
      new Category({ name: 'Jhon' }),
      new Category({ name: 'JHON' }),
      new Category({ name: 'fake' }),
    ];
    const spyFilter = jest.spyOn(items, 'filter');

    const filteredItems = await repository['applyFilter'](items, 'JHON');
    expect(spyFilter).toHaveBeenCalled();
    expect(filteredItems).toStrictEqual([items[0], items[1]]);
  });

  it('should sort by created_at when sort param is null', async () => {
    const created_at = new Date();
    const items = [
      new Category({ name: 'Jhon', created_at }),
      new Category({ name: 'JHON', created_at: new Date(created_at.getTime() + 100) }),
      new Category({ name: 'fake', created_at: new Date(created_at.getTime() + 200) }),
    ];

    const sortedItems = await repository['applySort'](items, null, null);
    expect(sortedItems).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name', async () => {
    const items = [
      new Category({ name: 'e'}),
      new Category({ name: 'c' }),
      new Category({ name: 'a' }),
      new Category({ name: 'b' }),
      new Category({ name: 'd' }),
    ];

    let sortedItems = await repository['applySort'](items, 'name', 'asc');
    expect(sortedItems).toStrictEqual([items[2], items[3], items[1], items[4], items[0]]);

    sortedItems = await repository['applySort'](items, 'name', 'desc');
    expect(sortedItems).toStrictEqual([items[0], items[4], items[1], items[3], items[2]]);
  });
})