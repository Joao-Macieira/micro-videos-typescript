import { Chance } from "chance";

import { Category } from "./category";

type PropOrFactory<T> = T | ((index: number) => T);

export class CategoryFakeBuilder<TBuild = any> {
  private chance: Chance.Chance;

  private name: PropOrFactory<string> = (_index) => this.chance.word();

  private description: PropOrFactory<string | null> = (_index) =>
    this.chance.paragraph();

  private is_active: PropOrFactory<boolean> = (_index) => true;

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

  withName(name: PropOrFactory<string>) {
    this.name = name;
    return this;
  }

  withDescription(description: PropOrFactory<string | null>) {
    this.description = description;
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

  build(): TBuild {
    const categories = new Array(this.countObjs).fill(undefined).map(
      (_, index) =>
        new Category({
          name: this.callFactory(this.name, index),
          description: this.callFactory(this.description, index),
          is_active: this.callFactory(this.is_active, index),
        })
    );

    return this.countObjs === 1 ? categories[0] as any : categories;
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === "function"
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
