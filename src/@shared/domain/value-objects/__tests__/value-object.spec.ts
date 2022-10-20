import ValueObject from "../value-objects";

class StubValueObject extends ValueObject {}

describe("Value objects ubit tests", () => {
  it("should set value", () => {
    let vo = new StubValueObject('string value');
    expect(vo.value).toBe('string value');

    vo = new StubValueObject({ props1: 'value1' });
    expect(vo.value).toStrictEqual({ props1: 'value1' });
  })
});
