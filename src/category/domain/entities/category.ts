import Entity from "../../../@shared/domain/entities/entity";
import UniqueEntityId from "../../../@shared/domain/value-objects/unique-entity-id.value-object";

export interface CategoryProps {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
}

export class Category extends Entity<CategoryProps> {
  constructor(public readonly props: CategoryProps, id?: UniqueEntityId) {
    super(props, id);
    this.description = this.props.description;
    this.is_active = this.props.is_active;
    this.props.created_at = this.props.created_at ?? new Date();
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get is_active() {
    return this.props.is_active;
  }

  get created_at() {
    return this.props.created_at;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  private set description(value: string) {
    this.props.description = value ?? null;
  }

  private set is_active(value: boolean) {
    this.props.is_active = value ?? true;
  }

  update(name: string, description: string): void {
    this.name = name;
    this.description = description;
  }

  activate(): void {
    this.is_active = true;
  }

  deactivate(): void {
    this.is_active = false;
  }
}
