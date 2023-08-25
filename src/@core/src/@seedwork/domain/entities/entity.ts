import { ValueObject } from "../value-objects";

export abstract class Entity<
  EntityId extends ValueObject = any,
  Props = any,
  JsonProps = Required<{ id: string } & Props>
> {
  constructor(public readonly props: Props, public readonly entityId: EntityId) {}

  get id(): string {
    return this.entityId.value;
  }

  abstract toJSON(): JsonProps;
}

export default Entity;
