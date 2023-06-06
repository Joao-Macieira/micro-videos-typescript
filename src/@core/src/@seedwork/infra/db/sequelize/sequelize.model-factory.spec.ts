import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import _chance from 'chance';
import { validate as uuidValidate } from 'uuid';

import { SequelizeModelFactory } from "./sequelize.model-factory";
import { setupSequelize } from "../testing/helpers/db";

const chance = _chance();

@Table({})
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  static mockFactory = jest.fn(() => ({
    id: chance.guid({ version: 4 }),
    name: chance.word()
  }));

  static factory() {
    return new SequelizeModelFactory(StubModel, StubModel.mockFactory);
  }
}

describe('Sequelize model factory tests', () => {
  setupSequelize({
    models: [StubModel]
  });

  test('create method', async () => {
    let model = await StubModel.factory().create();

    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    let modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toBe(modelFound.id);

    model = await StubModel.factory().create({
      id: "e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3",
      name: "test",
    });

    expect(model.id).toBe("e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3");
    expect(model.name).toBe("test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toBe(modelFound.id);
  });
});