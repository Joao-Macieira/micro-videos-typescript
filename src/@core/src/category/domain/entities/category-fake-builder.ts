import { Chance } from "chance";

import { Category } from "./category";
import { UniqueEntityId } from "#seedwork/domain";

type PropOrFactory<T> = T | ((index: number) => T);

export class CategoryFakeBuilder<TBuild = any> {
  private chance: Chance.Chance;

  // auto generated in entity
  private unique_entity_id = undefined;

  private name: PropOrFactory<string> = (_index) => this.chance.word();

  private description: PropOrFactory<string | null> = (_index) =>
    this.chance.paragraph();

  private is_active: PropOrFactory<boolean> = (_index) => true;

  // auto generated in entity
  private created_at = undefined;

  private countObjs: number;

  constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  static aCategory() {
    return new CategoryFakeBuilder<Category>();
  }

  static theCategories(countObjs: number) {
    return new CategoryFakeBuilder<Category[]>(countObjs);
  }

  withUniqueEntityId(valueOrFactory: PropOrFactory<UniqueEntityId>) {
    this.unique_entity_id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this.name = valueOrFactory;
    return this;
  }

  withInvalidName(invalidName: "" | null | undefined) {
    this.name = invalidName;
    return this;
  }

  withInvalidNameNotAString(invalidName?: any) {
    this.name = invalidName ?? 5;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this.name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  withDescription(valueOrFactory: PropOrFactory<string | null>) {
    this.description = valueOrFactory;
    return this;
  }

  withInvalidDescriptionNotAString(invalidDescription?: any) {
    this.description = invalidDescription ?? 5;
    return this;
  }

  active() {
    this.is_active = true;
    return this;
  }

  deactive() {
    this.is_active = false;
    return this;
  }

  withInvalidIsActiveEmpty(invalidIsActive: "" | null | undefined) {
    this.is_active = invalidIsActive as any;
    return this;
  }

  withInvalidIsActiveNotABoolean(invalidIsActive?: any) {
    this.is_active = invalidIsActive ?? "fake boolean";
    return this;
  }

  withCreatedAt(valuesOrFactory: PropOrFactory<Date>) {
    this.created_at = valuesOrFactory;
    return this;
  }

  build(): TBuild {
    const categories = new Array(this.countObjs).fill(undefined).map(
      (_, index) =>
        new Category({
          ...(this.unique_entity_id && {
            unique_entity_id: this.callFactory(this.unique_entity_id, index),
          }),
          name: this.callFactory(this.name, index),
          description: this.callFactory(this.description, index),
          is_active: this.callFactory(this.is_active, index),
          ...(this.created_at && {
            created_at: this.callFactory(this.created_at, index),
          }),
        })
    );

    return this.countObjs === 1 ? (categories[0] as any) : categories;
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === "function"
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
