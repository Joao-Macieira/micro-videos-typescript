import ValueObject from "../value-objects";

class StubValueObject extends ValueObject {}

describe("Value objects ubit tests", () => {
  it("should set value", () => {
    let vo = new StubValueObject('string value');
    expect(vo.value).toBe('string value');

    vo = new StubValueObject({ props1: 'value1' });
    expect(vo.value).toStrictEqual({ props1: 'value1' });
  });

  it("sould convert to string", () => {
    const date = new Date();

    const arrange = [
      { received: null, expected: "null" },
      { received: undefined, expected: "undefined" },
      { received: "", expected: "" },
      { received: "fake test", expected: "fake test" },
      { received: 0, expected: "0" },
      { received: 1, expected: "1" },
      { received: 5, expected: "5" },
      { received: true, expected: "true" },
      { received: false, expected: "false" },
      { received: date, expected: date.toString() },
      { received: { prop: 'value' }, expected: JSON.stringify({ prop: 'value' }) },
    ];

    arrange.forEach((value) => {
      const vo = new StubValueObject(value.received);
      expect(`${vo}`).toBe(value.expected);
    });
  });
});
