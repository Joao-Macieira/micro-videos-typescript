import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigModuleOptions,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { join } from 'path';
import joi from 'joi';

type DB_SCHEMA_TYPE = {
  DB_VENDOR: 'mysql' | 'sqlite';
  DB_HOST: string;
  DB_DATABASE: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_LOGGING: boolean;
  DB_AUTO_LOAD_MODELS: boolean;
};

export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE;

export const CONFIG_DB_SCHEMA: joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
  DB_VENDOR: joi.string().required().valid('mysql', 'sqlite'),
  DB_HOST: joi.string().required(),
  DB_DATABASE: joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: joi.required(),
  }),
  DB_USERNAME: joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: joi.required(),
  }),
  DB_PASSWORD: joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: joi.required(),
  }),
  DB_PORT: joi.number().integer().when('DB_VENDOR', {
    is: 'mysql',
    then: joi.required(),
  }),
  DB_LOGGING: joi.boolean().required(),
  DB_AUTO_LOAD_MODELS: joi.boolean().required(),
};

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return super.forRoot({
      envFilePath: [
        ...(Array.isArray(options.envFilePath)
          ? options.envFilePath
          : [options.envFilePath]),
        join(__dirname, `../envs/.env.${process.env.NODE_ENV}`),
        join(__dirname, '../envs/.env'),
      ],
      validationSchema: joi.object({
        ...CONFIG_DB_SCHEMA,
      }),
      ...options,
    });
  }
}
