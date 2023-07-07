import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { CreateCategoryUseCase } from '@core/micro-videos/category/application';

export class CreateCategoryDto implements CreateCategoryUseCase.Input {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
