import UniqueEntityId from "../../../@shared/domain/value-objects/unique-entity-id.value-object";

import { Category, CategoryProps } from "./category";

describe("Category Unit Tests", () => {
  it("category constructor", () => {
    let category = new Category({
      name: "Movie",
    });

    expect(category.props.name).toBe("Movie");
    expect(category.props.description).toBeNull();
    expect(category.props.is_active).toBeTruthy();
    expect(category.props.created_at).toBeInstanceOf(Date);

    let created_at = new Date();

    category = new Category({
      name: "Movie",
      description: "Movie description",
      is_active: false,
      created_at,
    });

    expect(category.props).toStrictEqual({
      name: "Movie",
      description: "Movie description",
      is_active: false,
      created_at,
    });

    category = new Category({
      name: "Movie",
      description: "Other movie description",
    });

    expect(category.props).toMatchObject({
      name: "Movie",
      description: "Other movie description",
    });

    category = new Category({
      name: "Movie",
      is_active: true,
    });

    expect(category.props).toMatchObject({
      name: "Movie",
      is_active: true,
    });

    category = new Category({
      name: "Movie",
      created_at,
    });

    expect(category.props).toMatchObject({
      name: "Movie",
      created_at,
    });
  });

  it("id field", () => {
    type CategoryData = {
      props: CategoryProps;
      id?: UniqueEntityId;
    };

    const data: CategoryData[] = [
      {
        props: {
          name: "Movie",
        },
      },
      {
        props: {
          name: "Movie",
        },
        id: null,
      },
      {
        props: {
          name: "Movie",
        },
        id: undefined,
      },
      {
        props: {
          name: "Movie",
        },
        id: new UniqueEntityId(),
      },
    ];

    data.forEach((item) => {
      const category = new Category(item.props, item.id);
      expect(category.id).not.toBeNull();
      expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    });
  });

  it("getter of name field", () => {
    const category = new Category({
      name: "Movie",
    });

    expect(category.name).toBe("Movie");

    category['name'] = 'Series';
    expect(category.name).toBe("Series");
  });

  it("getter and setter of description field", () => {
    let category = new Category({
      name: "Movie",
    });

    expect(category.description).toBeNull();

    category = new Category({
      name: "Movie",
      description: "Movie description",
    });

    expect(category.description).toBe("Movie description");

    category = new Category({
      name: "Movie",
    });

    category["description"] = "other description";

    expect(category.description).toBe("other description");

    category["description"] = undefined;
    expect(category.description).toBeNull();

    category["description"] = null;
    expect(category.description).toBeNull();
  });

  it("getter and setter of is_active field", () => {
    let category = new Category({
      name: "Movie",
    });

    expect(category.is_active).toBeTruthy();

    category = new Category({
      name: "Movie",
      is_active: true,
    });

    expect(category.is_active).toBeTruthy();

    category = new Category({
      name: "Movie",
      is_active: false,
    });

    expect(category.is_active).toBeFalsy();
  });

  it("getter of created_at field", () => {
    let category = new Category({
      name: "Movie",
    });

    expect(category.created_at).toBeInstanceOf(Date);

    const created_at = new Date();

    category = new Category({
      name: "Movie",
      created_at,
    });

    expect(category.created_at).toBe(created_at);
  });

  it('should update category name and description', () => {
    const category = new Category({
      name: "Movie",
    });

    expect(category.name).toBe('Movie');
    expect(category.description).toBeNull();

    category.update('Series', 'Good to see in family');

    expect(category.name).toBe('Series');
    expect(category.description).toBe('Good to see in family');
  });

  it('should activate and deactivate category', () => {
    const category = new Category({
      name: "Movie",
    });

    expect(category.is_active).toBeTruthy();

    category.deactivate();
    expect(category.is_active).toBeFalsy();

    category.activate();
    expect(category.is_active).toBeTruthy();
  });
});
