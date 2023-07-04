import { Chance } from "chance";

import { Category } from "./category";
import { UniqueEntityId } from "#seedwork/domain";

type PropOrFactory<T> = T | ((index: number) => T);

export class CategoryFakeBuilder<TBuild = any> {
  private chance: Chance.Chance;

  // auto generated in entity
  private _unique_entity_id = undefined;

  private _name: PropOrFactory<string> = (_index) => this.chance.word();

  private _description: PropOrFactory<string | null> = (_index) =>
    this.chance.paragraph();

  private _is_active: PropOrFactory<boolean> = (_index) => true;

  // auto generated in entity
  private _created_at = undefined;

  private countObjs: number;

  private constructor(countObjs: number = 1) {
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
    this._unique_entity_id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withInvalidName(invalidName: "" | null | undefined) {
    this._name = invalidName;
    return this;
  }

  withInvalidNameNotAString(invalidName?: any) {
    this._name = invalidName ?? 5;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  withDescription(valueOrFactory: PropOrFactory<string | null>) {
    this._description = valueOrFactory;
    return this;
  }

  withInvalidDescriptionNotAString(invalidDescription?: any) {
    this._description = invalidDescription ?? 5;
    return this;
  }

  active() {
    this._is_active = true;
    return this;
  }

  deactive() {
    this._is_active = false;
    return this;
  }

  withInvalidIsActiveEmpty(invalidIsActive: "" | null | undefined) {
    this._is_active = invalidIsActive as any;
    return this;
  }

  withInvalidIsActiveNotABoolean(invalidIsActive?: any) {
    this._is_active = invalidIsActive ?? "fake boolean";
    return this;
  }

  withCreatedAt(valuesOrFactory: PropOrFactory<Date>) {
    this._created_at = valuesOrFactory;
    return this;
  }

  build(): TBuild {
    const categories = new Array(this.countObjs).fill(undefined).map(
      (_, index) =>
        new Category(
          {
            name: this.callFactory(this._name, index),
            description: this.callFactory(this._description, index),
            is_active: this.callFactory(this._is_active, index),
            ...(this._created_at && {
              created_at: this.callFactory(this._created_at, index),
            }),
          },
          !this._unique_entity_id
            ? undefined
            : this.callFactory(this._unique_entity_id, index)
        )
    );

    return this.countObjs === 1 ? (categories[0] as any) : categories;
  }

  get unique_entity_id() {
    return this.getValue("unique_entity_id");
  }

  get name() {
    return this.getValue("name");
  }

  get description() {
    return this.getValue("description");
  }

  get is_active() {
    return this.getValue("is_active");
  }

  get created_at() {
    return this.getValue("created_at");
  }

  private getValue(prop: string) {
    const optional = ["unique_entity_id", "created_at"];
    const privateProp = `_${prop}`;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`
      );
    }

    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === "function"
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
