import { SortDirection } from '@core/micro-videos/@seedwork/domain';
import { ListCastMemberUseCase } from '@core/micro-videos/cast-member/application';
import { Types } from '@core/micro-videos/cast-member/domain';
import { Transform } from 'class-transformer';

export class SearchCastMemberDto implements ListCastMemberUseCase.Input {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  @Transform(({ value }) => {
    if (value) {
      return {
        ...(value.name && { name: value.name }),
        ...(value.type && {
          type: !Number.isNaN(parseInt(value.type))
            ? parseInt(value.type)
            : value.type,
        }),
      };
    }

    return value;
  })
  filter?: {
    name?: string;
    type?: Types;
  };
}
