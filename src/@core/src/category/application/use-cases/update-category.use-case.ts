import { CategoryRepository } from "#category/domain/repository/category.repository";
import { default as DefaultUseCase } from "#seedwork/application/use-case";

import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";

export namespace UpdateCategoryUseCase {
  export type Input = {
    id: string;
    name: string;
    description?: string;
    is_active?: boolean;
  }
  
  export type Output = CategoryOutput;
  
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private categoryRepository: CategoryRepository.Repository
    ) {}
  
    async execute(input: Input): Promise<Output> {
      const entity = await this.categoryRepository.findById(input.id);
  
      entity.update(input.name, input.description);
  
      if(input.is_active === true) {
        entity.activate();
      }
  
      if(input.is_active === false) {
        entity.deactivate();
      }
  
      await this.categoryRepository.update(entity);
  
      return CategoryOutputMapper.toOutput(entity);
    }
  }
}

export default UpdateCategoryUseCase;
