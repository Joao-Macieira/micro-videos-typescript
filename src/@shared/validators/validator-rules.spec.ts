import ValidationError from "../errors/validation-error";
import ValidatorRules from "./validator-rules";

type Values = {
  value: any;
  property: string;
}

type AssetsValidationRules = {
  value: any,
  property: string;
  rule: keyof ValidatorRules;
  error: ValidationError;
  params?: any[];
}

function assertIsInvalid(expected: AssetsValidationRules) {
  expect(() => {
    runRule(expected)
  }).toThrow(expected.error);
}

function assertIsValid(expected: AssetsValidationRules) {
  expect(() => {
    runRule(expected)
  }).not.toThrow();
}

function runRule({
  value,
  property,
  rule,
  params = []
}: Omit<AssetsValidationRules, 'error'>) {
  const validator = ValidatorRules.values(value, property);
  const method = validator[rule];
  // @ts-ignore
  method.apply(validator,params);
}

describe("Validator rules unit tests", () => {
  test("values method", () => {
    const validator = ValidatorRules.values("some value", "field");
    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator["value"]).toBe("some value");
    expect(validator["property"]).toBe("field");
  });

  test("required validation rule", () => {
    let arrange: Values[] = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: '', property: 'field' },
    ];

    const error = new ValidationError('The field is required');

    arrange.forEach((item) => {
      assertIsInvalid({ value: item.value, property: item.property, rule: 'required', error });
    });

    arrange = [
      { value: 'test', property: 'field' },
      { value: 5, property: 'field' },
      { value: 0, property: 'field' },
      { value: false, property: 'field' },
    ];

    arrange.forEach((item) => {
      assertIsValid({ value: item.value, property: item.property, rule: 'required', error: new ValidationError('') });
    });
  });

  test('string validation rule', () => {
    let arrange: Values[] = [
      { value: 5, property: 'field' },
      { value: {}, property: 'field' },
      { value: false, property: 'field' },
    ];

    const error = new ValidationError('The field must be a string');

    arrange.forEach((item) => {
      assertIsInvalid({ value: item.value, property: item.property, rule: 'string', error });
    });

    arrange = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: 'test', property: 'field' },
    ];

    arrange.forEach((item) => {
      assertIsValid({ value: item.value, property: item.property, rule: 'string', error: new ValidationError('') });
    });
  });

  test('maxLength validation rule', () => {
    let arrange: Values[] = [
      { value: 'aaaaa', property: 'field' },
    ];

    const maxLength = 4;
    const error = new ValidationError(`The field must be less or equal than ${maxLength} characters`);

    arrange.forEach((item) => {
      assertIsInvalid({ value: item.value, property: item.property, rule: 'maxLength', error, params: [maxLength] });
    });

    arrange = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: 'test', property: 'field' },
    ];

    arrange.forEach((item) => {
      assertIsValid({ value: item.value, property: item.property, rule: 'maxLength', error: new ValidationError(''), params: [maxLength] });
    });
  });

  test('boolean validation rule', () => {
    let arrange: Values[] = [
      { value: 5, property: 'field' },
      { value: 'true', property: 'field' },
      { value: 'false', property: 'field' },
    ];

    const error = new ValidationError('The field must be a boolean');

    arrange.forEach((item) => {
      assertIsInvalid({ value: item.value, property: item.property, rule: 'boolean', error });
    });

    arrange = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: false, property: 'field' },
      { value: true, property: 'field' },
    ];

    arrange.forEach((item) => {
      assertIsValid({ value: item.value, property: item.property, rule: 'boolean', error: new ValidationError('') });
    });
  });

  it('should trhow a validation error when combine two or more validation rules', () => {
    let validator = ValidatorRules.values(null, 'field');
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(
      new ValidationError('The field is required')
    );

    validator = ValidatorRules.values(5, 'field');
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(
      new ValidationError('The field must be a string')
    );

    validator = ValidatorRules.values('123456', 'field');
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(
      new ValidationError('The field must be less or equal than 5 characters')
    );
    
    validator = ValidatorRules.values(null, 'field');
    expect(() => {
      validator.required().boolean();
    }).toThrow(
      new ValidationError('The field is required')
    );

    validator = ValidatorRules.values(5, 'field');
    expect(() => {
      validator.required().boolean();
    }).toThrow(
      new ValidationError('The field must be a boolean')
    );
  });

  it('should valid when combine two or more validation rules', () => {
    expect.assertions(0);

    ValidatorRules.values('test', 'field').required().string();

    ValidatorRules.values('tests', 'field').required().string().maxLength(5);

    ValidatorRules.values(true, 'field').required().boolean();
    ValidatorRules.values(false, 'field').required().boolean();
  });
});
