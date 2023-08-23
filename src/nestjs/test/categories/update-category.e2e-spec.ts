import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import {
  Category,
  CategoryRepository,
} from '@core/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { UpdateCategoryFixture } from '../../src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';
import { startApp } from '../../src/@shared/testing/helpers';

describe('CategoriesController (e2e)', () => {
  let categoryRepository: CategoryRepository.Repository;
  const uuid = 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3';

  describe('/categories/:id (PUT)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const nestApp = startApp();
      const faker = Category.fake().aCategory();
      const arrange = [
        {
          id: 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3',
          send_data: { name: faker.name },
          expected: {
            message:
              'Entity not found using ID e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          send_data: { name: faker.name },
          expected: {
            message: 'Validation failed (uuid is expected)',
            statusCode: 422,
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)(
        'when id is $id',
        async ({ id, send_data, expected }) => {
          return request(nestApp.app.getHttpServer())
            .put(`/categories/${id}`)
            .send(send_data)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    describe('should a response error with 422 when request body is invalid', () => {
      const app = startApp();
      const invalidRequest = UpdateCategoryFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .put(`/categories/${uuid}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should a response error with 422 when throw EntityValidationError', () => {
      const app = startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [];
        },
      });

      const invalidRequest =
        UpdateCategoryFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      beforeEach(() => {
        categoryRepository = app.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
      });

      test.each(arrange)('when body is $label', async ({ value }) => {
        const category = Category.fake().aCategory().build();
        await categoryRepository.insert(category);
        return request(app.app.getHttpServer())
          .put(`/categories/${category.id}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should update a category', () => {
      const app = startApp();
      const arrange = UpdateCategoryFixture.arrangeForSave();

      beforeEach(async () => {
        categoryRepository = app.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
      });

      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const categoryCreated = Category.fake().aCategory().build();
          await categoryRepository.insert(categoryCreated);
          const response = await request(app.app.getHttpServer())
            .put(`/categories/${categoryCreated.id}`)
            .send(send_data)
            .expect(200);

          const keysInResponse =
            UpdateCategoryFixture.keysInCategoriesResponse();

          expect(Object.keys(response.body)).toStrictEqual(['data']);
          expect(Object.keys(response.body.data)).toStrictEqual(keysInResponse);

          const categoryUpdated = await categoryRepository.findById(
            response.body.data.id,
          );
          const presenter = CategoriesController.categoryToResponse(
            categoryUpdated.toJSON(),
          );
          const serialized = instanceToPlain(presenter);

          expect(response.body.data).toStrictEqual(serialized);
          expect(response.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...send_data,
            ...expected,
          });
        },
      );
    });
  });
});
