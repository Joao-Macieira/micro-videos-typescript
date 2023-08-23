/* eslint-disable @typescript-eslint/no-namespace */
import { getModelToken } from '@nestjs/sequelize';
import {
  CastMemberInMemoryRepository,
  CastMemberSequelize,
} from '@core/micro-videos/cast-member/infra';
import {
  CreateCastMemberUseCase,
  DeleteCastMemberUseCase,
  GetCastMemberUseCase,
  ListCastMemberUseCase,
  UpdateCastMemberUseCase,
} from '@core/micro-videos/cast-member/application';
import { CastMemberRepository } from '@core/micro-videos/cast-member/domain';

export namespace CAST_MEMBER_PROVIDERS {
  export namespace REPOSITORIES {
    export const CAST_MEMBER_IN_MEMORY_REPOSITORY = {
      provide: 'CastMemberInMemoryRepository',
      useClass: CastMemberInMemoryRepository,
    };

    export const CAST_MEMBER_SEQUELIZE_REPOSITORY = {
      provide: 'CastMemberSequelizeRepository',
      useFactory: (
        castMemberModel: typeof CastMemberSequelize.CastMemberModel,
      ) => {
        return new CastMemberSequelize.CastMemberRepository(castMemberModel);
      },
      inject: [getModelToken(CastMemberSequelize.CastMemberModel)],
    };

    export const CAST_MEMBER_REPOSITORY = {
      provide: 'CastMemberRepository',
      useExisting: 'CastMemberSequelizeRepository',
    };
  }

  export namespace USE_CASES {
    export const CREATE_CAST_MEMBER_USE_CASE = {
      provide: CreateCastMemberUseCase.UseCase,
      useFactory: (castMemberRepo: CastMemberRepository.Repository) => {
        return new CreateCastMemberUseCase.UseCase(castMemberRepo);
      },
      inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
    };

    export const UPDATE_CAST_MEMBER_USE_CASE = {
      provide: UpdateCastMemberUseCase.UseCase,
      useFactory: (castMemberRepo: CastMemberRepository.Repository) => {
        return new UpdateCastMemberUseCase.UseCase(castMemberRepo);
      },
      inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
    };

    export const LIST_CATEGORIES_USE_CASE = {
      provide: ListCastMemberUseCase.UseCase,
      useFactory: (castMemberRepo: CastMemberRepository.Repository) => {
        return new ListCastMemberUseCase.UseCase(castMemberRepo);
      },
      inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
    };

    export const GET_CAST_MEMBER_USE_CASE = {
      provide: GetCastMemberUseCase.UseCase,
      useFactory: (castMemberRepo: CastMemberRepository.Repository) => {
        return new GetCastMemberUseCase.UseCase(castMemberRepo);
      },
      inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
    };

    export const DELETE_CAST_MEMBER_USE_CASE = {
      provide: DeleteCastMemberUseCase.UseCase,
      useFactory: (castMemberRepo: CastMemberRepository.Repository) => {
        return new DeleteCastMemberUseCase.UseCase(castMemberRepo);
      },
      inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
    };
  }
}
