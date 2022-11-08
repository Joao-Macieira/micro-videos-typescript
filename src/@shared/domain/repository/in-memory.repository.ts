import Entity from "../entities/entity";
import NotFoundError from "../errors/not-found.error";
import uniqueEntityId from "../value-objects/unique-entity-id.value-object";
import {
  RepositoryInterface,
  SearchableRepositoryInterface,
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
  implements SearchableRepositoryInterface<E, any, any> {
  search(props: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
