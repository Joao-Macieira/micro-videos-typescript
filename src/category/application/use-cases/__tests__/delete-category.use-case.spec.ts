import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
import NotFoundError from "../../../../@shared/domain/errors/not-found.error";
import { Category } from "../../../domain/entities/category";
import DeleteCategoryUseCase from "../delete-category.use-case";


describe('DeleteCategoryUseCase unit tests', () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase(repository);
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
