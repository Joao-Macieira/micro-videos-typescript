import { default as DefaultUseCase } from "#seedwork/application/use-case";
import { PaginationOutputDto, PaginationOutputMapper, SearchInputDto } from "#seedwork/application";
import { CastMemberRepository, Types } from "../../domain";
import { CastMemberOutput, CastMemberToOutputMapper } from "../dto";

export namespace ListCastMemberUseCase {
  export type Input = SearchInputDto<{ name?: string; type?: Types }>;

  export type Output = PaginationOutputDto<CastMemberOutput>;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly castMemberRepository: CastMemberRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = CastMemberRepository.SearchParams.create(input);
      const searchResult = await this.castMemberRepository.search(params);

      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: CastMemberRepository.SearchResult): Output {
      const items = searchResult.items.map((item) => CastMemberToOutputMapper.toOutput(item));
      // @ts-expect-error
      const pagination = PaginationOutputMapper.toOutput(items, searchResult);

      return {
        items,
        ...pagination,
      }
    }
  }
}

export default ListCastMemberUseCase;
