import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@core/micro-videos/category/application';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Put,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './presenter/category.presenter';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase.UseCase)
  private createCategoryUseCase: CreateCategoryUseCase.UseCase;

  @Inject(UpdateCategoryUseCase.UseCase)
  private updateCategoryUsecase: UpdateCategoryUseCase.UseCase;

  @Inject(DeleteCategoryUseCase.UseCase)
  private deleteCategoryUseCase: DeleteCategoryUseCase.UseCase;

  @Inject(GetCategoryUseCase.UseCase)
  private getCategoryUseCase: GetCategoryUseCase.UseCase;

  @Inject(ListCategoriesUseCase.UseCase)
  private listCategoryUseCase: ListCategoriesUseCase.UseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createCategoryUseCase.execute(createCategoryDto);

    return new CategoryPresenter(output);
  }

  @Get()
  async search(@Query() searchParams: SearchCategoryDto) {
    const output = await this.listCategoryUseCase.execute(searchParams);

    return new CategoryCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getCategoryUseCase.execute({ id });

    return new CategoryPresenter(output);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const output = await this.updateCategoryUsecase.execute({
      id,
      ...updateCategoryDto,
    });

    return new CategoryPresenter(output);
  }
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteCategoryUseCase.execute({ id });
  }
}
