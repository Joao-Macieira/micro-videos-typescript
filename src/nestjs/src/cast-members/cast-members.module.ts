import { Module } from '@nestjs/common';
import { CastMembersController } from './cast-members.controller';
import { CAST_MEMBER_PROVIDERS } from './cast-members.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { CastMemberSequelize } from '@core/micro-videos/cast-member/infra';

@Module({
  imports: [SequelizeModule.forFeature([CastMemberSequelize.CastMemberModel])],
  controllers: [CastMembersController],
  providers: [
    ...Object.values(CAST_MEMBER_PROVIDERS.REPOSITORIES),
    ...Object.values(CAST_MEMBER_PROVIDERS.USE_CASES),
  ],
})
export class CastMembersModule {}
