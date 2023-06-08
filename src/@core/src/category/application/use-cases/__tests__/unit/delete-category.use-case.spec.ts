import CategoryInMemoryRepository from "#category/infra/db/in-memory/category-in-memory.repository";
import { Category } from "#category/domain/entities/category";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
import DeleteCategoryUseCase from "../../delete-category.use-case";



describe('DeleteCategoryUseCase unit tests', () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(new NotFoundError('Entity not found using ID fake id'));
  });

  it('should delete a category', async () => {
    const category = new Category({ name: 'Movie' });
    repository.items = [category];

    const spyDelete = jest.spyOn(repository, 'delete');

    await useCase.execute({ id: category.id });

    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(repository.items).toHaveLength(0);
  });
});
