import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/sequelize';
import { Umzug } from 'umzug';
import { migrator } from '@core/micro-videos/@seedwork/infra';
import { MigrationModule } from '../src/database/migration/migration.module';

describe('Migrate (e2e)', () => {
  let umzug: Umzug;
  const totalMigrations = 2;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MigrationModule],
    }).compile();

    const sequelize = moduleFixture.get(getConnectionToken());
    umzug = migrator(sequelize, { logger: undefined });
  });

  test('up command', async () => {
    await umzug.down({ to: 0 as any });
    const result = await umzug.up();

    expect(result).toHaveLength(totalMigrations);
  });

  test('down command', async () => {
    await umzug.up();
    const result = await umzug.down({ to: 0 as any });

    expect(result).toHaveLength(totalMigrations);
  });
});
