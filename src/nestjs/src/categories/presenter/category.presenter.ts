import { Transform } from 'class-transformer';
import { CategoryOutput } from '@core/micro-videos/category/application';

export class CategoryPresenter {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;

  @Transform(({ value }) => value.toISOString())
  created_at: Date;

  constructor(output: CategoryOutput) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.is_active = output.is_active;
    this.created_at = output.created_at;
  }
}