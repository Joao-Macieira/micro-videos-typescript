import { Test } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as joi from 'joi';
import { DatabaseModule } from './database.module';
import { CONFIG_DB_SCHEMA, ConfigModule } from '../config/config.module';

describe('Database module tests', () => {
  describe('sqlite connection', () => {
    const connectionOptions = {
      DB_VENDOR: 'sqlite',
      DB_HOST: ':memory:',
      DB_LOGGING: false,
      DB_AUTO_LOAD_MODELS: true,
    };

    it('should be valid', () => {
      const schema = joi.object({
        ...CONFIG_DB_SCHEMA,
      });
      const { error } = schema.validate(connectionOptions);

      expect(error).toBeUndefined();
    });

    it('should be a sqlite connection', async () => {
      const module = await Test.createTestingModule({
        imports: [
          DatabaseModule,
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            ignoreEnvVars: true,
            validationSchema: null,
            load: [() => connectionOptions],
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      const connection = app.get<Sequelize>(getConnectionToken());

      expect(connection).toBeDefined();
      expect(connection.options.dialect).toBe('sqlite');
      expect(connection.options.host).toBe(':memory:');
      await connection.close();
    });
  });

  describe('mysql connection', () => {
    const connectionOptions = {
      DB_VENDOR: 'mysql',
      DB_HOST: 'localhost',
      DB_DATABASE: 'micro-videos',
      DB_USERNAME: 'root',
      DB_PASSWORD: 'root',
      DB_PORT: 3306,
      DB_LOGGING: false,
      DB_AUTO_LOAD_MODELS: true,
    };

    it('should be valid', () => {
      const schema = joi.object({
        ...CONFIG_DB_SCHEMA,
      });
      const { error } = schema.validate(connectionOptions);

      expect(error).toBeUndefined();
    });

    // it('should be a mysql connection', async () => {
    //   const module = await Test.createTestingModule({
    //     imports: [
    //       DatabaseModule,
    //       ConfigModule.forRoot({
    //         isGlobal: true,
    //         ignoreEnvFile: true,
    //         ignoreEnvVars: true,
    //         validationSchema: null,
    //         load: [() => connectionOptions],
    //       }),
    //     ],
    //   }).compile();

    //   const app = module.createNestApplication();
    //   const connection = app.get<Sequelize>(getConnectionToken());

    //   expect(connection).toBeDefined();
    //   expect(connection.options.dialect).toBe('mysql');
    //   expect(connection.options.host).toBe('localhost');
    //   expect(connection.options.database).toBe('micro-videos');
    //   expect(connection.options.username).toBe('root');
    //   expect(connection.options.password).toBe('root');
    //   expect(connection.options.port).toBe(3306);
    //   await connection.close();
    // });
  });
});
