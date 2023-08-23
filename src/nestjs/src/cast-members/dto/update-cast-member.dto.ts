import { CreateCastMemberDto } from './create-cast-member.dto';
import { UpdateCastMemberUseCase } from '@core/micro-videos/cast-member/application';

export class UpdateCastMemberDto
  extends CreateCastMemberDto
  implements Omit<UpdateCastMemberUseCase.Input, 'id'> {}
