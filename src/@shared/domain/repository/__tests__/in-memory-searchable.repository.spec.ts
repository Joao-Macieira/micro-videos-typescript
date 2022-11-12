import Entity from "../../entities/entity";
import { InMemorySearchableRepository } from "../in-memory.repository";

type StubEntitiesProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntitiesProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ["name"];

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter(
      (item) =>
        item.props.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.props.price.toString() === filter
    );
  }
}

describe("InMemorySearchableRepository Unit tests", () => {
  let repository: StubInMemorySearchableRepository;

  beforeEach(() => {
    repository = new StubInMemorySearchableRepository();
  });
  describe('applyFilter method', () => {
    it('should no filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'name value', price: 5 })];
      const spyFilterMethod = jest.spyOn(items, 'filter' as any);
      const filteredItems = await repository['applyFilter'](items, null);

      expect(filteredItems).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it('should filter using a filter param', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'TEST', price: 5 }),
        new StubEntity({ name: 'fake', price: 0 }),
      ];
      const spyFilterMethod = jest.spyOn(items, 'filter' as any);
      let filteredItems = await repository['applyFilter'](items, 'TEST');

      expect(filteredItems).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      filteredItems = await repository['applyFilter'](items, '5');
      expect(filteredItems).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      filteredItems = await repository['applyFilter'](items, 'no-filter');
      expect(filteredItems).toHaveLength(0)
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });

  describe('applySort method', () => {});

  describe('applyPaginate method', () => {});

  describe('search method', () => {});
});
