import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import {
  Category,
  CategoryRepository,
} from '@core/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { CategoryFixture } from '../../src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';
import { startApp } from '../../src/@shared/testing/helpers';

describe('CategoriesController (e2e)', () => {
  let categoryRepository: CategoryRepository.Repository;
  const app = startApp();
  describe('/categories/:id (GET)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3',
          expected: {
            message:
              'Entity not found using ID e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            message: 'Validation failed (uuid is expected)',
            statusCode: 422,
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(app.app.getHttpServer())
          .get(`/categories/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should return a category', async () => {
      categoryRepository = app.app.get<CategoryRepository.Repository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );

      const category = Category.fake().aCategory().build();
      await categoryRepository.insert(category);

      const response = await request(app.app.getHttpServer())
        .get(`/categories/${category.id}`)
        .expect(200);

      const keysInResponse = CategoryFixture.keysInCategoriesResponse();

      expect(Object.keys(response.body)).toStrictEqual(['data']);
      expect(Object.keys(response.body.data)).toStrictEqual(keysInResponse);

      const presenter = CategoriesController.categoryToResponse(
        category.toJSON(),
      );
      const serialized = instanceToPlain(presenter);

      expect(response.body.data).toStrictEqual(serialized);
    });
  });
});
