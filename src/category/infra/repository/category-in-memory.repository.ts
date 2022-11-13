import { Category } from "../../domain/entities/category";
import { InMemorySearchableRepository } from "../../../@shared/domain/repository/in-memory.repository";
import CategoryRepository from "category/domain/repository/category.repository";

export default class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository {

  protected async applyFilter(
    items: Category[],
    filter: CategoryRepository.Filter
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter(
      (item) =>
        item.props.name.toLowerCase().includes(filter.toLowerCase())
    );
  }
}
