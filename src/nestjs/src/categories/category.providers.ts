import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@core/micro-videos/category/application';
import { CategoryRepository } from '@core/micro-videos/category/domain';
import { CategoryInMemoryRepository } from '@core/micro-videos/category/infra';

/* eslint-disable @typescript-eslint/no-namespace */
export namespace CATEGORY_PROVIDERS {
  export namespace REPOSITORIES {
    export const CATEGORY_IN_MEMORY_REPOSITORIES = {
      provide: 'CategoryInMemoryRepository',
      useClass: CategoryInMemoryRepository,
    };
  }

  export namespace USE_CASES {
    export const CREATE_CATEGORY_USE_CASE = {
      provide: CreateCategoryUseCase.UseCase,
      useFactory: (categoryRepository: CategoryRepository.Repository) => {
        return new CreateCategoryUseCase.UseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORIES.provide],
    };

    export const UPDATE_CATEGORY_USE_CASE = {
      provide: UpdateCategoryUseCase.UseCase,
      useFactory: (categoryRepository: CategoryRepository.Repository) => {
        return new UpdateCategoryUseCase.UseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORIES.provide],
    };

    export const DELETE_CATEGORY_USE_CASE = {
      provide: DeleteCategoryUseCase.UseCase,
      useFactory: (categoryRepository: CategoryRepository.Repository) => {
        return new DeleteCategoryUseCase.UseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORIES.provide],
    };

    export const GET_CATEGORY_USE_CASE = {
      provide: GetCategoryUseCase.UseCase,
      useFactory: (categoryRepository: CategoryRepository.Repository) => {
        return new GetCategoryUseCase.UseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORIES.provide],
    };

    export const LIST_CATEGORY_USE_CASE = {
      provide: ListCategoriesUseCase.UseCase,
      useFactory: (categoryRepository: CategoryRepository.Repository) => {
        return new ListCategoriesUseCase.UseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORIES.provide],
    };
  }
}
