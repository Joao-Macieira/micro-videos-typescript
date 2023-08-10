import { deepFreeze } from "./object";

describe('object unit tests', () => {
  it('should be a immutable object', () => {
    const objProp = {
      prop1: 'value1',
      deep: {
        prop2: 'value2',
        prop3: new Date()
      }
    };

    const obj = deepFreeze(objProp);

    expect(() => {
      (obj as any).prop1 = 'test'
    }).toThrow("Cannot assign to read only property 'prop1' of object '#<Object>'");

    expect(() => {
      (obj as any).deep.prop2 = 'test'
    }).toThrow("Cannot assign to read only property 'prop2' of object '#<Object>'");

    expect(obj.deep.prop3).toBeInstanceOf(Date);
  });

  it('should not freeze a scalar value', () => {
    const str = deepFreeze('a');
    expect(typeof str).toBe('string');

    let bool = deepFreeze(true);
    expect(typeof bool).toBe('boolean');

    bool = deepFreeze(false);
    expect(typeof bool).toBe('boolean');

    const num = deepFreeze(5);
    expect(typeof num).toBe('number');
  });

  it('should return passed value when this vlaue cant be freeze', () => {
    const nullFreezer = deepFreeze(null);
    expect(nullFreezer).toBeNull();
  });
});