import { CategoryRepository } from "#category/domain/repository/category.repository";
import UseCase from "#seedwork/application/use-case";
import { SearchInputDto } from "#seedwork/application/dto/search-input";
import { PaginationOutputDto, PaginationOutputMapper } from "#seedwork/application/dto/pagination-output";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";

export type Input = SearchInputDto;

export type Output = PaginationOutputDto<CategoryOutput>;

export default class ListCategoriesUseCase implements UseCase<Input, Output> {
  constructor(
    private categoryRepository: CategoryRepository.Repository
  ) {}

  async execute(input: Input): Promise<Output> {
    const params = new CategoryRepository.SearchParams(input);

    const searchResult = await this.categoryRepository.search(params);

    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CategoryRepository.SearchResult): Output {
    const items = searchResult.items.map(item => CategoryOutputMapper.toOutput(item));
    const pagination = PaginationOutputMapper.toOutput(searchResult);

    return {
      items,
      ...pagination,
    }
  }
}