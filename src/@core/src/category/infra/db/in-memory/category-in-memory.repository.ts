import { Category, CategoryId } from "#category/domain/entities/category";
import CategoryRepository from "#category/domain/repository/category.repository";
import { InMemorySearchableRepository } from "#seedwork/domain/repository/in-memory.repository";
import { SortDirection } from "#seedwork/domain/repository/repository.contracts";

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category, CategoryId>
  implements CategoryRepository.Repository {
    sortableFields: string[] = ['name', 'created_at'];

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

  protected async applySort(
    items: Category[],
    sort: string | null,
    sort_dir: SortDirection | null
  ): Promise<Category[]> {
    return !sort ? super.applySort(items, "created_at", "desc") : super.applySort(items, sort, sort_dir)
  }
}

export default CategoryInMemoryRepository;
