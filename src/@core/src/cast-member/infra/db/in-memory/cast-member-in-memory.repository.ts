import { InMemorySearchableRepository, SortDirection } from "#seedwork/domain";
import { CastMember, CastMemberId } from "cast-member/domain/entities/cast-member";
import CastMemberRepository from "cast-member/domain/repository/cast-member.repository";

// @ts-ignore
export class CastMemberInMemoryRepository extends InMemorySearchableRepository<
  CastMember,
  CastMemberId,
  CastMemberRepository.Filter
> implements CastMemberRepository.Repository {
  sortableFields: string[] = ["name", "created_at"];

  protected async applyFilter(items: CastMember[], filter: CastMemberRepository.Filter): Promise<CastMember[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) => {
      const containsName = filter.name && item.props.name.toLowerCase().includes(filter.name.toLowerCase());
      const hasType = filter.type && item.props.type.equals(filter.type);

      const onlyName = filter.name ? containsName : hasType;

      return filter.name && filter.type
        ? containsName && hasType
        : onlyName;
    });
  }

  protected async applySort(
    items: CastMember[],
    sort: string | null,
    sort_dir: SortDirection | null
  ): Promise<CastMember[]> {
    return !sort
      ? super.applySort(items, "created_at", "desc")
      : super.applySort(items, sort, sort_dir);
  }
}

export default CastMemberInMemoryRepository;
