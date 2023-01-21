import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";
import UseCase from "../../../@shared/application/use-case";

export type Input = {
  id: string;
}

export type Output = void;

export default class DeleteCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private categoryRepository: CategoryRepository.Repository
  ) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepository.findById(input.id);

    await this.categoryRepository.delete(entity.id);
  }
}
