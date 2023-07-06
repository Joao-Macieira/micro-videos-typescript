import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { AppModule } from '../../src/app.module';
import { CategoryRepository } from '@core/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { CategoryFixture } from '../../src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let categoryRepository: CategoryRepository.Repository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    categoryRepository = moduleFixture.get<CategoryRepository.Repository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /categories', () => {
    const arrange = CategoryFixture.arrangeForSave();
    describe('should create a category', () => {
      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const response = await request(app.getHttpServer())
            .post('/categories')
            .send(send_data)
            .expect(201);

          const keysInResponse = CategoryFixture.keysInCategoriesResponse();

          expect(Object.keys(response.body)).toStrictEqual(keysInResponse);

          const category = await categoryRepository.findById(response.body.id);
          const presenter = CategoriesController.categoryToResponse(
            category.toJSON(),
          );
          const serialized = instanceToPlain(presenter);

          expect(response.body).toStrictEqual(serialized);
          expect(response.body).toStrictEqual({
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
