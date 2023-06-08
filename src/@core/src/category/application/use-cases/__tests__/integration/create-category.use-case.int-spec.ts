
import { CreateCategoryUseCase } from "../../create-category.use-case";
import { CategorySequelize } from '../../../../infra/db/sequelize/category-sequelize';
import { setupSequelize } from "#seedwork/infra/db/testing/helpers/db";

const { CategoryRepository, CategoryModel } = CategorySequelize;

describe('CreateCategoryUseCase tests', () => {
  let useCase: CreateCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new CreateCategoryUseCase.UseCase(repository);
  });

  describe('test with test.each', () => {
    const arrange = [
      {
        input: { name: 'test' },
        output: {
          name: 'test',
          description: null,
          is_active: true,
        }
      },
      {
        input: {
          name: 'test',
          description: 'some description',
          is_active: false
        },
        output: {
          name: 'test',
          description: 'some description',
          is_active: false,
        }
      },
    ];
    
    test.each(arrange)('input $input, output $output', async ({ input, output }) => {
      const usecaseOutput = await useCase.execute(input);
      const entity = await repository.findById(usecaseOutput.id);
      expect(usecaseOutput).toMatchObject({
        name: output.name,
        description: output.description,
        is_active: output.is_active,
      });
      expect(usecaseOutput.id).toBe(entity.id);
      expect(usecaseOutput.created_at).toStrictEqual(entity.created_at);
    });
  });

  it('should create a category', async () => {
    let output = await useCase.execute({ name: 'test' });
    let entity = await repository.findById(output.id);
    expect(output).toStrictEqual({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.props.created_at,
    });

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
      is_active: false,
    });

    entity = await repository.findById(output.id);

    expect(output).toStrictEqual({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.props.created_at,
    });
  });
});
