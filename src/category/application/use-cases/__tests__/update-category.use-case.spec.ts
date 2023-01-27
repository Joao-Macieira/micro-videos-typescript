import CategoryInMemoryRepository from "#category/infra/repository/category-in-memory.repository";
import UpdateCategoryUseCase from "../update-category.use-case";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
import { Category } from "#category/domain/entities/category";


describe('UpdateCategoryUseCase unit tests', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(useCase.execute({ id: 'fake id', name: 'fake' })).rejects.toThrow(new NotFoundError('Entity not found using ID fake id'));
  });

  it('should update a category', async () => {
    const category = new Category({ name: 'Movie' });
    repository.items = [category];

    const spyUpdate = jest.spyOn(repository, 'update');

    let output = await useCase.execute({ id: category.id, name: 'test' });

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: category.id,
      name: 'test',
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });

    const arrange = [
      {
        input: {
          id: category.id,
          name: 'test',
          description: 'test description'
        },
        expected: {
          id: category.id,
          name: 'test',
          description: 'test description',
          is_active: category.is_active,
          created_at: category.created_at,
        }
      },
      {
        input: {
          id: category.id,
          name: 'test'
        },
        expected: {
          id: category.id,
          name: 'test',
          description: null,
          is_active: category.is_active,
          created_at: category.created_at,
        }
      },
      {
        input: {
          id: category.id,
          name: 'test',
          is_active: false,
        },
        expected: {
          id: category.id,
          name: 'test',
          description: null,
          is_active: false,
          created_at: category.created_at,
        }
      },
      {
        input: {
          id: category.id,
          name: 'test',
        },
        expected: {
          id: category.id,
          name: 'test',
          description: null,
          is_active: false,
          created_at: category.created_at,
        }
      },
      {
        input: {
          id: category.id,
          name: 'test',
          is_active: true
        },
        expected: {
          id: category.id,
          name: 'test',
          description: null,
          is_active: true,
          created_at: category.created_at,
        }
      },
      {
        input: {
          id: category.id,
          name: 'test',
          description: 'some description',
          is_active: false,
        },
        expected: {
          id: category.id,
          name: 'test',
          description: 'some description',
          is_active: false,
          created_at: category.created_at,
        }
      },
    ];

    for (const item of arrange) {
      output = await useCase.execute(item.input);
      expect(output).toStrictEqual(item.expected);
    }
  });
});
