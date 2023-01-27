import * as libClassValidator from "class-validator";

import { ClassValidatorFields } from "../class-validator-fields";

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string;
}> {}

describe("ClassValidatorFields unit tests", () => {
  it("should initialize errors and validatedData variables with null", () => {
    const validator = new StubClassValidatorFields();

    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toBeNull();
  });

  it("should validate with errors", () => {
    const spyValidateSync = jest
      .spyOn(libClassValidator, "validateSync")
      .mockReturnValue([
        {
          property: "field",
          constraints: { isRequired: "field is required" },
        },
      ]);

    const validator = new StubClassValidatorFields();

    expect(validator.validate(null)).toBeFalsy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(validator.validatedData).toBeNull();
    expect(validator.errors).toStrictEqual({
      field: ["field is required"],
    });
  });

  it("should validate without errors", () => {
    const spyValidateSync = jest
      .spyOn(libClassValidator, "validateSync")
      .mockReturnValue([]);

    const validator = new StubClassValidatorFields();

    expect(validator.validate({ field: 'value' })).toBeTruthy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(validator.validatedData).toStrictEqual({ field: 'value' });
    expect(validator.errors).toBeNull();
  });
});
