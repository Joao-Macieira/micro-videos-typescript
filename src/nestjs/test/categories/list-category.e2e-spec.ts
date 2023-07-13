import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { CategoryRepository } from '@core/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { ListCategoriesFixture } from '../../src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';
import { startApp } from '../../src/@shared/testing/helpers';

describe('CategoriesController (e2e)', () => {
  let categoryRepository: CategoryRepository.Repository;
  const app = startApp();
  describe('/categories (GET)', () => {
    describe('should return a categories ordered by created_at when request query is empty', () => {
      const nestApp = startApp();
      const { arrange, entitiesMap } =
        ListCategoriesFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        categoryRepository = nestApp.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        await categoryRepository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when query params is $send_data',
        ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          return request(app.app.getHttpServer())
            .get(`/categories?${queryParams}`)
            .expect(200)
            .expect({
              data: expected.entities.map((entity) =>
                instanceToPlain(
                  CategoriesController.categoryToResponse(entity),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });

    describe('should return a categories using paginate filter and sort', () => {
      const nestApp = startApp();
      const { arrange, entitiesMap } = ListCategoriesFixture.arrangeUnsorted();

      beforeEach(async () => {
        categoryRepository = nestApp.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        await categoryRepository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when query params is $send_data',
        ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          return request(app.app.getHttpServer())
            .get(`/categories?${queryParams}`)
            .expect(200)
            .expect({
              data: expected.entities.map((entity) =>
                instanceToPlain(
                  CategoriesController.categoryToResponse(entity),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });
  });
});
