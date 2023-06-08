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
    const model = await CategoryModel.factory().create();

    let output = await useCase.execute({ id: model.id, name: 'test' });
    expect(output).toStrictEqual({
      id: model.id,
      name: 'test',
      description: null,
      is_active: model.is_active,
      created_at: model.created_at,
    });

    const arrange = [
      {
        input: {
          id: model.id,
          name: 'test',
          description: 'test description'
        },
        expected: {
          id: model.id,
          name: 'test',
          description: 'test description',
          is_active: model.is_active,
          created_at: model.created_at,
        }
      },
      {
        input: {
          id: model.id,
          name: 'test'
        },
        expected: {
          id: model.id,
          name: 'test',
          description: null,
          is_active: model.is_active,
          created_at: model.created_at,
        }
      },
      {
        input: {
          id: model.id,
          name: 'test',
          is_active: false,
        },
        expected: {
          id: model.id,
          name: 'test',
          description: null,
          is_active: false,
          created_at: model.created_at,
        }
      },
      {
        input: {
          id: model.id,
          name: 'test',
        },
        expected: {
          id: model.id,
          name: 'test',
          description: null,
          is_active: false,
          created_at: model.created_at,
        }
      },
      {
        input: {
          id: model.id,
          name: 'test',
          is_active: true
        },
        expected: {
          id: model.id,
          name: 'test',
          description: null,
          is_active: true,
          created_at: model.created_at,
        }
      },
      {
        input: {
          id: model.id,
          name: 'test',
          description: 'some description',
          is_active: false,
        },
        expected: {
          id: model.id,
          name: 'test',
          description: 'some description',
          is_active: false,
          created_at: model.created_at,
        }
      },
    ];

    for (const item of arrange) {
      output = await useCase.execute(item.input);
      expect(output).toStrictEqual(item.expected);
    }
  });
});
