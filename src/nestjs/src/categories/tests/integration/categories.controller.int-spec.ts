import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../../categories.controller';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import { CategoriesModule } from '../../../categories/categories.module';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@core/micro-videos/category/application';

describe('CategoriesController integration tests', () => {
  let categoriesController: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    categoriesController = module.get(CategoriesController);
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
    expect(categoriesController['createCategoryUseCase']).toBeInstanceOf(
      CreateCategoryUseCase.UseCase,
    );
    expect(categoriesController['updateCategoryUsecase']).toBeInstanceOf(
      UpdateCategoryUseCase.UseCase,
    );
    expect(categoriesController['getCategoryUseCase']).toBeInstanceOf(
      GetCategoryUseCase.UseCase,
    );
    expect(categoriesController['listCategoryUseCase']).toBeInstanceOf(
      ListCategoriesUseCase.UseCase,
    );
    expect(categoriesController['deleteCategoryUseCase']).toBeInstanceOf(
      DeleteCategoryUseCase.UseCase,
    );
  });
});
