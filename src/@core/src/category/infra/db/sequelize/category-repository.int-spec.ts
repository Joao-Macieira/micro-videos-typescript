import _chance from 'chance';

import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/db/testing/helpers/db";
import { Category, CategoryRepository as CategoryRepositoryContract } from "#category/domain";
import { CategorySequelize } from './category-sequelize';

const chance = _chance();

const { CategoryModel, CategoryModelMapper, CategoryRepository } = CategorySequelize;
describe('Category sequelize repository integration test', () => {
  setupSequelize({
    models: [CategoryModel]
  });
  let repository: CategorySequelize.CategoryRepository;

  beforeEach(async () => {
    repository = new CategoryRepository(CategoryModel);
  });

  it('should inserts a new entity', async () => {
    let category = new Category({
      name: 'movie'
    });

    await repository.insert(category);

    let model = await repository.findById(category.id);

    expect(model.toJSON()).toStrictEqual(category.toJSON());

    category = new Category({
      name: 'movie',
      description: 'some description',
      is_active: false
    });

    await repository.insert(category);

    model = await repository.findById(category.id);

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

  it("should throw an error on update when a entity not found", async () => {
    const entity = new Category({ name: 'Movie' });
    await expect(repository.update(entity)).rejects.toThrow(new NotFoundError(`Entity not found using ID ${entity.id}`));
  });

  it('should update a entity', async () => {
    const entity = new Category({ name: 'Movie' });
    await repository.insert(entity);

    entity.update('Movie updated', entity.description);
    await repository.update(entity);
    const entityfound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityfound.toJSON());
  });

  it('should throw an error on delete when entity not found', async () => {
    await expect(repository.delete('fake id')).rejects.toThrow(new NotFoundError('Entity not found using ID fake id'));
    await expect(repository.delete(new UniqueEntityId("e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3")))
      .rejects
      .toThrow(new NotFoundError('Entity not found using ID e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3'));
  });

  it('should delete a entity', async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);

    await repository.delete(entity.id);

    await expect(repository.findById(entity.id)).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID ${entity.id}`
      )
    )
  });

  describe('search method tests', () => {
    it('should only apply paginate when other params are null', async () => {
      const created_at = new Date();
      await CategoryModel.factory().count(16).bulkCreate(() => ({
        id: chance.guid({ version: 4 }),
        name: 'Movie',
        description: null,
        is_active: true,
        created_at
      }));
      
      const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity');
      const searchOutput = await repository.search(new CategoryRepositoryContract.SearchParams({}));

      expect(searchOutput).toBeInstanceOf(CategoryRepositoryContract.SearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });

      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.id).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Movie',
          description: null,
          is_active: true,
          created_at
        })
      );
    });

    it('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date();
      const models = await CategoryModel.factory().count(16).bulkCreate((index) => ({
        id: chance.guid({ version: 4 }),
        name: `Movie-${index}`,
        description: null,
        is_active: true,
        created_at: new Date(created_at.getTime() + 100 + index)
      }));

      const searchOutput = await repository.search(new CategoryRepositoryContract.SearchParams({}));
      
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(item.name).toBe(`${models[index + 1].name}`);
      });
    });

    it('should apply paginate and filter', async () => {
      const categories = [
        Category.fake()
          .aCategory()
          .withName("test")
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("a")
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("TEST")
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("TeSt")
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];

      await repository.bulkInsert(categories);

      let searchOutput = await repository.search(new CategoryRepositoryContract.SearchParams({
        page: 1,
        per_page: 2,
        filter: "TEST"
      }));

      expect(searchOutput.toJSON(true)).toMatchObject(new CategoryRepositoryContract.SearchResult({
        items: [categories[0], categories[2]],
        total: 3,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: 'TEST',
      }).toJSON(true));

      searchOutput = await repository.search(new CategoryRepositoryContract.SearchParams({
        page: 2,
        per_page: 2,
        filter: "TEST"
      }));

      expect(searchOutput.toJSON()).toMatchObject(new CategoryRepositoryContract.SearchResult({
        items: [categories[3]],
        total: 3,
        current_page: 2,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: 'TEST',
      }).toJSON(true));
    });

    it('should apply paginate and sort', async () => {
      expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);

      const categories = [
        Category.fake().aCategory().withName("b").build(),
        Category.fake().aCategory().withName("a").build(),
        Category.fake().aCategory().withName("d").build(),
        Category.fake().aCategory().withName("e").build(),
        Category.fake().aCategory().withName("c").build(),
      ];
      await repository.bulkInsert(categories);

      const arrage = [
        {
          params: new CategoryRepositoryContract.SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
          }),
          result: new CategoryRepositoryContract.SearchResult({
            items: [categories[1], categories[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: null,
          })
        },
        {
          params: new CategoryRepositoryContract.SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
          }),
          result: new CategoryRepositoryContract.SearchResult({
            items: [categories[4], categories[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: null,
          })
        },
        {
          params: new CategoryRepositoryContract.SearchParams({
            page: 3,
            per_page: 2,
            sort: 'name',
          }),
          result: new CategoryRepositoryContract.SearchResult({
            items: [categories[3]],
            total: 5,
            current_page: 3,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: null,
          })
        },
      ];

      for (const i of arrage) {
        let result = await repository.search(i.params);
        expect(result.toJSON()).toMatchObject(i.result.toJSON(true));
      }
    });

    describe("should search using filter, sort and paginate", () => {
      const categories = [
        Category.fake().aCategory().withName("test").build(),
        Category.fake().aCategory().withName("a").build(),
        Category.fake().aCategory().withName("TEST").build(),
        Category.fake().aCategory().withName("e").build(),
        Category.fake().aCategory().withName("TeSt").build(),
      ];

      let arrange = [
        {
          search_params: new CategoryRepositoryContract.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: "TEST",
          }),
          search_result: new CategoryRepositoryContract.SearchResult({
            items: [categories[2], categories[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
        },
        {
          search_params: new CategoryRepositoryContract.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            filter: "TEST",
          }),
          search_result: new CategoryRepositoryContract.SearchResult({
            items: [categories[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(categories);
      });

      test.each(arrange)(
        "when value is $search_params",
        async ({ search_params, search_result }) => {
          let result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        }
      );
    });
  });
});
