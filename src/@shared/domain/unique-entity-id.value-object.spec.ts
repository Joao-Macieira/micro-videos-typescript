import { validate as uuidValidate } from "uuid";

import InvalidUUIDError from "../errors/invalid-uuid.error";
import UniqueEntityId from "./unique-entity-id.value-object";

describe("UniqueEntityId unit tests", () => {
  const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate");

  test("should throw error when uuid is invalid", () => {
    expect(() => {
      new UniqueEntityId('Fake id');
    }).toThrow(new InvalidUUIDError);
    expect(validateSpy).toHaveBeenCalled();
  });

  test("should accept a uuid passed in constructor", () => {
    const uuid = "e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3";
    const valueObject = new UniqueEntityId(uuid);

    expect(valueObject.id).toBe(uuid);
    expect(validateSpy).toHaveBeenCalled();
  });

  test("should create an uuid if constructor not receive one", () => {
    const valueObject = new UniqueEntityId();

    expect(uuidValidate(valueObject.id)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalled();
  });
});