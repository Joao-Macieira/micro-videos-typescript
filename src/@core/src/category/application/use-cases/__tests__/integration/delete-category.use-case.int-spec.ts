import { Category } from "#category/domain";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "#seedwork/infra/db/testing/helpers/db";
import DeleteCategoryUseCase from "../../delete-category.use-case";

const { CategoryRepository, CategoryModel } = CategorySequelize;

describe('DeleteCategoryUseCase integration tests', () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(new NotFoundError('Entity not found using ID fake id'));
  });

  it('should delete a category', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    await useCase.execute({ id: entity.id });
    const foundEntity = await CategoryModel.findByPk(entity.id);

    expect(foundEntity).toBeNull();
  });
});
