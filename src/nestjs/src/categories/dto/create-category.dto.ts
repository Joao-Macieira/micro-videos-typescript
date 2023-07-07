import { IsNotEmpty } from 'class-validator';
import { CreateCategoryUseCase } from '@core/micro-videos/category/application';

export class CreateCategoryDto implements CreateCategoryUseCase.Input {
  @IsNotEmpty()
  name: string;
  description?: string;
  is_active?: boolean;
}
