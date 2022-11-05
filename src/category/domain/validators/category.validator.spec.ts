import CategoryValidatorFactory, {
  CategoryRules,
  CategoryValidator,
} from "./category.validator";

describe("CategoryValidator tests", () => {
  let validator: CategoryValidator;

  beforeEach(() => {
    validator = CategoryValidatorFactory.create();
  });

  test("invalidation cases for name field", () => {
    const arrange = [
      {
        data: null,
        errors: [
          "name must be shorter than or equal to 255 characters",
          "name must be a string",
          "name should not be empty",
        ],
      },
      {
        data: '',
        errors: [
          "name must be shorter than or equal to 255 characters",
          "name must be a string",
          "name should not be empty",
        ],
      },
      {
        data: { name: '' },
        errors: [
          "name should not be empty",
        ],
      },
      {
        data: { name: 5 as any },
        errors: [
          "name must be shorter than or equal to 255 characters",
          "name must be a string",
        ],
      },
      {
        data: { name: 't'.repeat(256)},
        errors: [
          "name must be shorter than or equal to 255 characters",
        ],
      },
    ];

    arrange.forEach((item) => {
      expect({ validator, data: item.data}).containsErrorMessages({
        name: item.errors
      })
    });
  });

  test('invalidation cases for description field', () => {
    expect({ validator, data: { description: 5 } }).containsErrorMessages({
      description: ["description must be a string"]
    })
  });

  test('invalidation cases for is_active field', () => {
    const arrange = [
      {
        data: { is_active: 5 },
        errors: ["is_active must be a boolean value"]
      },
      {
        data: { is_active: 0 },
        errors: ["is_active must be a boolean value"]
      },
      {
        data: { is_active: 1 },
        errors: ["is_active must be a boolean value"]
      },
    ];

    arrange.forEach((item) => {
      expect({ validator, data: item.data}).containsErrorMessages({
        is_active: item.errors
      })
    });
  });

  test("valid cases for fields", () => {
    const arrange = [
      { name: "some value" },
      { name: "some value", description: undefined },
      { name: "some value", description: null },
      { name: "some value", is_active: false },
      { name: "some value", is_active: true },
    ];

    arrange.forEach((item) => {
      const isValid = validator.validate(item);
      expect(isValid).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new CategoryRules(item));
    });
  });
});
