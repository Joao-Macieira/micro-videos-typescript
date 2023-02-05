import CategoryRepository from "#category/domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";
import { default as DefaultUseCase } from "#seedwork/application/use-case";

export namespace GetCategoryUseCase {
  export type Input = {
    id: string;
  }
  
  export type Output = CategoryOutput;
  
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private categoryRepository: CategoryRepository.Repository
    ) {}
  
    async execute(input: Input): Promise<Output> { 
      const entity = await this.categoryRepository.findById(input.id);
  
      return CategoryOutputMapper.toOutput(entity);
    }
  }
}

export default GetCategoryUseCase;
