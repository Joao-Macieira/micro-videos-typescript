/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SortDirection } from '@core/micro-videos/@seedwork/domain';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@core/micro-videos/category/application';
import { CategoriesController } from '../../categories.controller';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { UpdateCategoryDto } from '../../dto/update-category.dto';

describe('CategoriesController unit tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should creates a category', async () => {
    const expectedOutput: CreateCategoryUseCase.Output = {
      id: 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3',
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    //@ts-expect-error
    controller['createCategoryUseCase'] = mockCreateUseCase;

    const output = await controller.create(input);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should updates a category', async () => {
    const id = 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3';

    const expectedOutput: UpdateCategoryUseCase.Output = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    const input: UpdateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    //@ts-expect-error
    controller['updateCategoryUsecase'] = mockUpdateUseCase;

    const output = await controller.update(id, input);

    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should delete a category', async () => {
    const expectedOutput: DeleteCategoryUseCase.Output = undefined;

    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    //@ts-expect-error
    controller['deleteCategoryUseCase'] = mockDeleteUseCase;

    const id = 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3';

    expect(controller.remove(id)).toBeInstanceOf(Promise);

    const output = await controller.remove(id);

    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should gets a category', async () => {
    const id = 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3';

    const expectedOutput: GetCategoryUseCase.Output = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    //@ts-expect-error
    controller['getCategoryUseCase'] = mockGetUseCase;

    const output = await controller.findOne(id);

    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should lists a category', async () => {
    const expectedOutput: ListCategoriesUseCase.Output = {
      items: [
        {
          id: 'e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3',
          name: 'Movie',
          description: 'some description',
          is_active: true,
          created_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };

    const mockSearchUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    //@ts-expect-error
    controller['listCategoryUseCase'] = mockSearchUseCase;

    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: 'test',
    };

    const output = await controller.search(searchParams);

    expect(mockSearchUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(output).toStrictEqual(expectedOutput);
  });
});
