/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@core/micro-videos/category/application';
import {
  Category,
  CategoryRepository,
} from '@core/micro-videos/category/domain';
import { NotFoundError } from '@core/micro-videos/@seedwork/domain';
import { CategoriesController } from '../../categories.controller';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import { CategoriesModule } from '../../../categories/categories.module';
import { CATEGORY_PROVIDERS } from '../../category.providers';

describe('CategoriesController integration tests', () => {
  let categoriesController: CategoriesController;
  let repository: CategoryRepository.Repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    categoriesController = module.get(CategoriesController);
    repository = module.get(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
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

  describe('should create category', () => {
    const arrange = [
      {
        request: {
          name: 'Movie',
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          description: null,
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          is_active: true,
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          description: 'movie description',
          is_active: true,
        },
        expectedPresenter: {
          name: 'Movie',
          description: 'movie description',
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          description: 'movie description',
          is_active: false,
        },
        expectedPresenter: {
          name: 'Movie',
          description: 'movie description',
          is_active: false,
        },
      },
    ];

    test.each(arrange)(
      'with request $request',
      async ({ request, expectedPresenter }) => {
        const output = await categoriesController.create(request);

        const entity = await repository.findById(output.id);

        expect(entity).toMatchObject({
          id: output.id,
          name: expectedPresenter.name,
          description: expectedPresenter.description,
          is_active: expectedPresenter.is_active,
          created_at: output.created_at,
        });

        expect(output.id).toBe(entity.id);
        expect(output.name).toBe(expectedPresenter.name);
        expect(output.description).toBe(expectedPresenter.description);
        expect(output.is_active).toBe(expectedPresenter.is_active);
        expect(output.created_at).toStrictEqual(entity.created_at);
      },
    );
  });

  describe('should update a category', () => {
    const category = Category.fake().aCategory().build();

    beforeEach(async () => {
      repository.insert(category);
    });

    const arrange = [
      {
        request: {
          name: 'Movie',
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          description: null,
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          is_active: false,
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: false,
        },
      },
      {
        request: {
          name: 'Movie',
          description: 'movie description',
          is_active: true,
        },
        expectedPresenter: {
          name: 'Movie',
          description: 'movie description',
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          description: 'movie description',
          is_active: false,
        },
        expectedPresenter: {
          name: 'Movie',
          description: 'movie description',
          is_active: false,
        },
      },
      {
        request: {
          name: 'Movie',
          description: 'movie description',
          is_active: true,
        },
        expectedPresenter: {
          name: 'Movie',
          description: 'movie description',
          is_active: true,
        },
      },
    ];

    test.each(arrange)(
      'with request $request',
      async ({ request, expectedPresenter }) => {
        const presenter = await categoriesController.update(
          category.id,
          request,
        );

        const entity = await repository.findById(presenter.id);

        expect(entity).toMatchObject({
          id: presenter.id,
          name: expectedPresenter.name,
          description: expectedPresenter.description,
          is_active: expectedPresenter.is_active,
          created_at: presenter.created_at,
        });

        expect(presenter.id).toBe(entity.id);
        expect(presenter.name).toBe(expectedPresenter.name);
        expect(presenter.description).toBe(expectedPresenter.description);
        expect(presenter.is_active).toBe(expectedPresenter.is_active);
        expect(presenter.created_at).toStrictEqual(entity.created_at);
      },
    );
  });

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    const response = await categoriesController.remove(category.id);

    expect(response).not.toBeDefined();

    expect(repository.findById(category.id)).rejects.toThrowError(
      new NotFoundError(`Entity not found using ID ${category.id}`),
    );
  });

  it('should get a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const presenter = await categoriesController.findOne(category.id);

    expect(presenter.id).toBe(category.id);
    expect(presenter.name).toBe(category.name);
    expect(presenter.description).toBe(category.description);
    expect(presenter.is_active).toBe(category.is_active);
    expect(presenter.created_at).toStrictEqual(category.created_at);
  });
});
