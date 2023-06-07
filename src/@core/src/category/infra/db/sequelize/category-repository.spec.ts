import _chance from 'chance';

import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/db/testing/helpers/db";
import { Category, CategoryRepository } from "#category/domain";
import { CategorySequelizeRepository } from './category-repository';
import { CategoryModel } from "./category-model";
import { CategoryModelMapper } from './category-mapper';

const chance = _chance();
describe('Category sequelize repository integration test', () => {
  setupSequelize({
    models: [CategoryModel]
  });
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it('should inserts a new entity', async () => {
    let category = new Category({
      name: 'movie'
    });

    await repository.insert(category);

    let model = await CategoryModel.findByPk(category.id);

    expect(model.toJSON()).toStrictEqual(category.toJSON());

    category = new Category({
      name: 'movie',
      description: 'some description',
      is_active: false
    });

    await repository.insert(category);

    model = await CategoryModel.findByPk(category.id);

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
      const searchOutput = await repository.search(new CategoryRepository.SearchParams({}));

      expect(searchOutput).toBeInstanceOf(CategoryRepository.SearchResult);
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
      await CategoryModel.factory().count(16).bulkCreate((index) => ({
        id: chance.guid({ version: 4 }),
        name: `Movie-${index}`,
        description: null,
        is_active: true,
        created_at: new Date(created_at.getTime() + 100 + index)
      }));

      const searchOutput = await repository.search(new CategoryRepository.SearchParams({}));
      
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(item.name).toBe(`Movie-${index + 1}`);
      });
    });

    it('should apply paginate and filter', async () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date()
      };

      const categoriesProps = [
        { id: chance.guid({ version: 4 }), name: 'test', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TEST', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TeSt', ...defaultProps },
      ];

      const categories = await CategoryModel.bulkCreate(categoriesProps);

      let searchOutput = await repository.search(new CategoryRepository.SearchParams({
        page: 1,
        per_page: 2,
        filter: "TEST"
      }));

      expect(searchOutput.toJSON()).toMatchObject(new CategoryRepository.SearchResult({
        items: [
          CategoryModelMapper.toEntity(categories[0]),
          CategoryModelMapper.toEntity(categories[2])
        ],
        total: 3,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: 'TEST',
      }).toJSON(true));

      searchOutput = await repository.search(new CategoryRepository.SearchParams({
        page: 2,
        per_page: 2,
        filter: "TEST"
      }));

      expect(searchOutput.toJSON()).toMatchObject(new CategoryRepository.SearchResult({
        items: [
          CategoryModelMapper.toEntity(categories[3])
        ],
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

      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date()
      };

      const categoriesProps = [
        { id: chance.guid({ version: 4 }), name: 'b', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'd', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'e', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'c', ...defaultProps },
      ];

      const categories = await CategoryModel.bulkCreate(categoriesProps);

      const arrage = [
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
          }),
          result: new CategoryRepository.SearchResult({
            items: [
              CategoryModelMapper.toEntity(categories[1]),
              CategoryModelMapper.toEntity(categories[0])
            ],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: null,
          })
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
          }),
          result: new CategoryRepository.SearchResult({
            items: [
              CategoryModelMapper.toEntity(categories[4]),
              CategoryModelMapper.toEntity(categories[2])
            ],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: null,
          })
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 3,
            per_page: 2,
            sort: 'name',
          }),
          result: new CategoryRepository.SearchResult({
            items: [
              CategoryModelMapper.toEntity(categories[3]),
            ],
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

    describe('should search using filter, sort and paginate', () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date()
      };

      const categoriesProps = [
        { id: chance.guid({ version: 4 }), name: 'test', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TEST', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'e', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TeSt', ...defaultProps },
      ];

      const arrange = [
        {
          params: new CategoryRepository.SearchParams({ page: 1, per_page: 2, sort: 'name', filter: 'TEST' }),
          result: new CategoryRepository.SearchResult({
            items: [
              new Category(categoriesProps[2]),
              new Category(categoriesProps[4]),
            ],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'TEST',
          })
        },
        {
          params: new CategoryRepository.SearchParams({ page: 2, per_page: 2, sort: 'name', filter: 'TEST' }),
          result: new CategoryRepository.SearchResult({
            items: [
              new Category(categoriesProps[0]),
            ],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'TEST',
          })
        },
        {
          params: new CategoryRepository.SearchParams({ page: 1, per_page: 2, sort: 'name', sort_dir: 'desc', filter: 'TEST' }),
          result: new CategoryRepository.SearchResult({
            items: [
              new Category(categoriesProps[0]),
              new Category(categoriesProps[4]),
            ],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            filter: 'TEST',
          })
        },
        {
          params: new CategoryRepository.SearchParams({ page: 1, per_page: 2, sort: 'name', sort_dir: 'desc', filter: 'a' }),
          result: new CategoryRepository.SearchResult({
            items: [
              new Category(categoriesProps[1]),
            ],
            total: 1,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            filter: 'a',
          })
        }
      ];

      beforeEach(async () => {
        await CategoryModel.bulkCreate(categoriesProps);
      });

      test.each(arrange)("when value is $params", async ({ params, result }) => {
        const searchOutput = await repository.search(params);
        expect(searchOutput.toJSON(true)).toStrictEqual(result.toJSON(true));
      });
    });
  });
});
