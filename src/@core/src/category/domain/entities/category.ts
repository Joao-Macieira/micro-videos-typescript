import UniqueEntityId from "#seedwork/domain/value-objects/unique-entity-id.value-object";
import { EntityValidationError } from "#seedwork/domain/errors/validation-error";
import CategoryValidatorFactory from "../validators/category.validator";
import { CategoryFakeBuilder } from "./category-fake-builder";
import AggregateRoot from "#seedwork/domain/entities/aggregate-root";

export interface CategoryProps {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
}

export type CategoryPropsJson = Required<{ id: string } & CategoryProps>;

export class CategoryId extends UniqueEntityId {}

export class Category extends AggregateRoot<CategoryId,CategoryProps, CategoryPropsJson> {
  constructor(public readonly props: CategoryProps, entityId?: CategoryId) {
    Category.validate(props);
    super(props, entityId ?? new CategoryId());
    this.description = this.props.description;
    this.is_active = this.props.is_active;
    this.props.created_at = this.props.created_at ?? new Date();
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get is_active(): boolean {
    return this.props.is_active;
  }

  get created_at(): Date {
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
    Category.validate({ name, description });
    this.name = name;
    this.description = description;
  }

  static validate(props: CategoryProps) {
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) throw new EntityValidationError(validator.errors);
  }

  activate(): void {
    this.is_active = true;
  }

  deactivate(): void {
    this.is_active = false;
  }

  static fake() {
    return CategoryFakeBuilder;
  }

  toJSON(): CategoryPropsJson {
    return {
      id: this.id.toString(),
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
    }
  }
}
