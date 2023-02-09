import { ListCategoriesUseCase } from '@core/micro-videos/category/application';
import { SortDirection } from '@core/micro-videos/@seedwork/domain';

export class SearchCategoryDto implements ListCategoriesUseCase.Input {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: string;
}
