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

  it('immutable', () => {
    const objProp = {
      prop1: 'value1',
      deep: {
        prop2: 'value2',
        prop3: new Date()
      }
    };

    const vo = new StubValueObject(objProp);

    expect(() => {
      (vo as any).value.prop1 = 'test'
    }).toThrow("Cannot assign to read only property 'prop1' of object '#<Object>'");

    expect(() => {
      (vo as any).value.deep.prop2 = 'test'
    }).toThrow("Cannot assign to read only property 'prop2' of object '#<Object>'");

    expect(vo.value.deep.prop3).toBeInstanceOf(Date);
  });
});
