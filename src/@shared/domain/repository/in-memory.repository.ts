import Entity from "../entities/entity";
import NotFoundError from "../errors/not-found.error";
import uniqueEntityId from "../value-objects/unique-entity-id.value-object";
import {
  RepositoryInterface,
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
} from "./repository.contracts";

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: string | uniqueEntityId): Promise<E> {
    return this._get(`${id}`);
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id);
    const index = this.items.findIndex((item) => item.id === entity.id);
    this.items[index] = entity;
  }

  async delete(id: string | uniqueEntityId): Promise<void> {
    const _id = `${id}`;
    await this._get(_id);
    const index = this.items.findIndex((item) => item.id === _id);
    this.items.splice(index, 1);
  }

  protected async _get(id: string) {
    const item = this.items.find((entity) => entity.id === id);

    if (!item) throw new NotFoundError(`Entity not found using ID ${id}`);

    return item;
  }
}

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E>
{
  async search(props: SearchParams): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter);
    const itemsSorted = await this.applySort(
      itemsFiltered,
      props.sort,
      props.sort_dir
    );

    const itemsPaginated = await this.applyPaginate(itemsSorted, props.page, props.per_page);

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      current_page: props.page,
      per_page: props.per_page,
      sort: props.sort,
      sort_dir: props.sort_dir,
      filter: props.filter,
    })
  }

  protected abstract applyFilter(
    items: E[],
    filter: string | null
  ): Promise<E[]>;

  protected abstract applySort(
    items: E[],
    sort: string | null,
    sort_dir: string | null
  ): Promise<E[]>;

  protected abstract applyPaginate(
    items: E[],
    page: SearchParams["page"],
    per_page: SearchParams["per_page"]
  ): Promise<E[]>;
}
