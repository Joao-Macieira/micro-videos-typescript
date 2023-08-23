import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategorySequelize } from '@core/micro-videos/category/infra';
import { CONFIG_SCHEMA_TYPE } from 'src/config/config.module';
import { CastMemberSequelize } from '@core/micro-videos/cast-member/infra';

const models = [
  CategorySequelize.CategoryModel,
  CastMemberSequelize.CastMemberModel,
];

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService<CONFIG_SCHEMA_TYPE>) => {
        if (configService.get('DB_VENDOR') === 'sqlite') {
          return {
            dialect: 'sqlite',
            host: configService.get('DB_HOST'),
            models,
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
            logging: configService.get('DB_LOGGING'),
          };
        }

        if (configService.get('DB_VENDOR') === 'mysql') {
          return {
            dialect: 'mysql',
            host: configService.get('DB_HOST'),
            database: configService.get('DB_DATABASE'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            port: configService.get('DB_PORT'),
            models,
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
            logging: configService.get('DB_LOGGING'),
          };
        }

        throw new Error('Unsupported database config');
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
