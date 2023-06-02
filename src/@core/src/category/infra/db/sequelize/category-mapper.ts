import { Category } from "#category/domain";
import { EntityValidationError, LoadEntityError, UniqueEntityId } from "#seedwork/domain";
import { CategoryModel } from "./category-model";

export class CategoryModelMapper {
  static toEntity(model: CategoryModel) {
    const { id, ...otherData } = model.toJSON();

    try {
      return new Category(otherData, new UniqueEntityId(id));
    } catch (err) {
      if (err instanceof EntityValidationError) {
        throw new LoadEntityError(err.error);
      }

      throw err;
    }
  }
}