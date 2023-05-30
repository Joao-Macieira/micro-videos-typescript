import { Category } from "#category/domain";
import { UniqueEntityId } from "#seedwork/domain";
import { CategoryModel } from "./category-model";

export class CategoryModelMapper {
  static toEntity(model: CategoryModel) {
    const { id, ...otherData } = model.toJSON();

    return new Category(otherData, new UniqueEntityId(id));
  }
}