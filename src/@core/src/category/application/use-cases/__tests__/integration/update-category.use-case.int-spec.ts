import { Category } from "#category/domain";
import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
import { setupSequelize } from "#seedwork/infra/db/testing/helpers/db";
import UpdateCategoryUseCase from "../../update-category.use-case";

const { CategoryRepository, CategoryModel } = CategorySequelize;


describe('UpdateCategoryUseCase integration tests', () => {
  let useCase: UpdateCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase.UseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(useCase.execute({ id: 'fake id', name: 'fake' })).rejects.toThrow(new NotFoundError('Entity not found using ID fake id'));
  });

  it('should update a category', async () => {
    const entity = Category.fake().aCategory().build();
    repository.insert(entity);
    
    let output = await useCase.execute({ id: entity.id, name: 'test' });
    expect(output).toStrictEqual({
      id: entity.id,
      name: 'test',
      description: null,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });

    const arrange = [
      {
        input: {
          id: entity.id,
          name: 'test',
          description: 'test description'
        },
        expected: {
          id: entity.id,
          name: 'test',
          description: 'test description',
          is_active: entity.is_active,
          created_at: entity.created_at,
        }
      },
      {
        input: {
          id: entity.id,
          name: 'test'
        },
        expected: {
          id: entity.id,
          name: 'test',
          description: null,
          is_active: entity.is_active,
          created_at: entity.created_at,
        }
      },
      {
        input: {
          id: entity.id,
          name: 'test',
          is_active: false,
        },
        expected: {
          id: entity.id,
          name: 'test',
          description: null,
          is_active: false,
          created_at: entity.created_at,
        }
      },
      {
        input: {
          id: entity.id,
          name: 'test',
        },
        expected: {
          id: entity.id,
          name: 'test',
          description: null,
          is_active: false,
          created_at: entity.created_at,
        }
      },
      {
        input: {
          id: entity.id,
          name: 'test',
          is_active: true
        },
        expected: {
          id: entity.id,
          name: 'test',
          description: null,
          is_active: true,
          created_at: entity.created_at,
        }
      },
      {
        input: {
          id: entity.id,
          name: 'test',
          description: 'some description',
          is_active: false,
        },
        expected: {
          id: entity.id,
          name: 'test',
          description: 'some description',
          is_active: false,
          created_at: entity.created_at,
        }
      },
    ];

    for (const item of arrange) {
      output = await useCase.execute(item.input);
      expect(output).toStrictEqual(item.expected);

      const entityUpdated = await repository.findById(item.input.id);
      expect(entityUpdated.toJSON()).toStrictEqual(item.expected);
    }
  });
});
