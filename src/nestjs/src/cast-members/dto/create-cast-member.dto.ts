import { IsString, IsNotEmpty, IsIn, IsInt } from 'class-validator';
import { Types } from '@core/micro-videos/cast-member/domain';
import { CreateCastMemberUseCase } from '@core/micro-videos/cast-member/application';

export class CreateCastMemberDto implements CreateCastMemberUseCase.Input {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn([Types.ACTOR, Types.DIRECTOR])
  @IsInt()
  @IsNotEmpty()
  type: Types;
}
