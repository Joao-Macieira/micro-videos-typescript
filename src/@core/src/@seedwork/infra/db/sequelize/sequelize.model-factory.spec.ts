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
    expect(model.id).not.toBeNull();
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

  test('make method', async () => {
    let model = await StubModel.factory().make();

    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.id).not.toBeNull();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    model = await StubModel.factory().make({
      id: "e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3",
      name: "test",
    });

    expect(model.id).toBe('e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3');
    expect(model.name).toBe('test');
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    const modelFound = await StubModel.findByPk(model.id);
    expect(modelFound).toBeNull();
  });

  test('bulk create method using default count', async () => {
    let models = await StubModel.factory().bulkCreate();

    expect(models).toHaveLength(1);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    let modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toBe(modelFound.id);
    expect(models[0].name).toBe(modelFound.name);

    models = await StubModel.factory().bulkCreate(() => ({
      id: "e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3",
      name: "test",
    }));

    expect(models[0].id).toBe("e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3");
    expect(models[0].name).toBe("test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toBe(modelFound.id);
    expect(models[0].name).toBe(modelFound.name);
  });

  test('bulk create method using count > 1', async () => {
    let models = await StubModel.factory().count(2).bulkCreate();

    expect(models).toHaveLength(2);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(models[1].id).not.toBeNull();
    expect(models[1].name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);

    let modelFound1 = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toBe(modelFound1.id);
    expect(models[0].name).toBe(modelFound1.name);

    let modelFound2 = await StubModel.findByPk(models[1].id);
    expect(models[1].id).toBe(modelFound2.id);
    expect(models[1].name).toBe(modelFound2.name);

    models = await StubModel.factory().count(2).bulkCreate(() => ({
      id: chance.guid({ version: 4 }),
      name: 'test'
    }));

    expect(models[0].id).not.toBe(models[1].id);
    expect(models[0].name).toBe("test");
    expect(models[1].name).toBe("test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
  });

  test('bulk make method using default count', async () => {
    let models = await StubModel.factory().bulkMake();

    expect(models).toHaveLength(1);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    let modelFound = await StubModel.findByPk(models[0].id);
    expect(modelFound).toBeNull();

    models = await StubModel.factory().bulkMake(() => ({
      id: "e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3",
      name: "test",
    }));

    expect(models).toHaveLength(1);
    expect(models[0].id).toBe("e3e15329-fb1a-4ae4-a06b-7dde81ffa4a3");
    expect(models[0].name).toBe("test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    modelFound = await StubModel.findByPk(models[0].id);
    expect(modelFound).toBeNull();
  });

  test('bulk make method using count > 1', async () => {
    let models = await StubModel.factory().count(2).bulkMake();

    expect(models).toHaveLength(2);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(models[1].id).not.toBeNull();
    expect(models[1].name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);

    let modelFound1 = await StubModel.findByPk(models[0].id);
    expect(modelFound1).toBeNull();

    let modelFound2 = await StubModel.findByPk(models[1].id);
    expect(modelFound2).toBeNull();

    models = await StubModel.factory().count(2).bulkMake(() => ({
      id: chance.guid({ version: 4 }),
      name: 'test'
    }));

    expect(models[0].id).not.toBe(models[1].id);
    expect(models[0].name).toBe("test");
    expect(models[1].name).toBe("test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);

    modelFound1 = await StubModel.findByPk(models[0].id);
    expect(modelFound1).toBeNull();

    modelFound2 = await StubModel.findByPk(models[1].id);
    expect(modelFound2).toBeNull();
  });
});