import { Category } from "#category/domain/entities/category";
import CategoryInMemoryRepository from "#category/infra/db/in-memory/category-in-memory.repository";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
import { GetCategoryUseCase } from "../../get-category.use-case";

describe('GetCategoryUseCase unit tests', () => {
  let useCase: GetCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase.UseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(new NotFoundError('Entity not found using ID fake id'));
  });

  it('should returns a category', async () => {
    const spyFindById = jest.spyOn(repository, 'findById');

    const newCategory = new Category({ name: 'Movie' });

    const items = [
      newCategory
    ];

    repository.items = items;

    const output = await useCase.execute({ id: newCategory.id });

    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: newCategory.id,
      name: newCategory.name,
      description: newCategory.description,
      is_active: newCategory.is_active,
      created_at: newCategory.created_at
    })
  });
});
