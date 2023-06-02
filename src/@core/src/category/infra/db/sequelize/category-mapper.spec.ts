import { Sequelize } from "sequelize-typescript";
import { Category } from "#category/domain";
import { CategoryModel } from "./category-model";
import { CategoryModelMapper } from "./category-mapper";
import { LoadEntityError, UniqueEntityId } from "#seedwork/domain";

describe('CategoryModelMapper tests', () => {
  let sequelize: Sequelize;


  beforeAll(() => 
    sequelize = new Sequelize({
      dialect: 'sqlite',
      host: ':memory:',
      logging: true,
      models: [CategoryModel],
    })
  );

  beforeEach(async () => {
    await sequelize.sync({
      force: true,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should throws error when category is invalid', () => {
    const model = CategoryModel.build({ id: '9366b7dc-2d71-4799-b91c-c64adb205104' });

    try {
      CategoryModelMapper.toEntity(model);
      fail('The category is valid, but it need throws a LoadEntityError');
    } catch(err) {
      expect(err).toBeInstanceOf(LoadEntityError);
      expect(err.error).toMatchObject({
        name: [
          'name must be shorter than or equal to 255 characters',
          'name must be a string',
          'name should not be empty',
        ]
      });
    }
  });

  it('should throw a  generic error', () => {
    const error = new Error('Generic error');
    const spyValidate = jest.spyOn(Category, 'validate').mockImplementation(() => {
      throw error;
    });
  
    const model = CategoryModel.build({ id: '9366b7dc-2d71-4799-b91c-c64adb205104' });

    expect(() => CategoryModelMapper.toEntity(model)).toThrow(error);
    expect(spyValidate).toHaveBeenCalled();
  });

  it('should convert a category model to a category entity', () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'test name',
      description: 'test description',
      is_active: true,
      created_at
    });

    const entity = CategoryModelMapper.toEntity(model);

    expect(entity.toJSON()).toStrictEqual(new Category({
      name: 'test name',
      description: 'test description',
      is_active: true,
      created_at
    }, new UniqueEntityId('9366b7dc-2d71-4799-b91c-c64adb205104')).toJSON());
  });
});
