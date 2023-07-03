import { Category } from "#category/domain";
import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
import { setupSequelize } from "#seedwork/infra/db/testing/helpers/db";
import { GetCategoryUseCase } from "../../get-category.use-case";

const { CategoryRepository, CategoryModel } = CategorySequelize;

describe('GetCategoryUseCase integration tests', () => {
  let useCase: GetCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new GetCategoryUseCase.UseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(new NotFoundError('Entity not found using ID fake id'));
  });

  it('should returns a category', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);
    const output = await useCase.execute({ id: entity.id });

    expect(output).toStrictEqual({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at
    })
  });
});
