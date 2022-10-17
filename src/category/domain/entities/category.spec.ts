import UniqueEntityId from "../../../@shared/domain/unique-entity-id.value-object";

import { Category, CategoryProps } from "./category";

describe("Category Unit Tests", () => {
  test("category constructor", () => {
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

  test("id field", () => {
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
      expect(category.id).toBeInstanceOf(UniqueEntityId)
    });
  });

  test("getter of name field", () => {
    const category = new Category({
      name: "Movie",
    });

    expect(category.name).toBe("Movie");
  });

  test("getter and setter of description field", () => {
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

  test("getter and setter of is_active field", () => {
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

  test("getter of created_at field", () => {
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
});
