import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Query,
  ParseUUIDPipe,
  Put,
  HttpCode,
} from '@nestjs/common';

import { CreateCastMemberDto } from './dto/create-cast-member.dto';
import { UpdateCastMemberDto } from './dto/update-cast-member.dto';
import {
  CastMemberOutput,
  CreateCastMemberUseCase,
  DeleteCastMemberUseCase,
  GetCastMemberUseCase,
  ListCastMemberUseCase,
  UpdateCastMemberUseCase,
} from '@core/micro-videos/cast-member/application';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from './presenter/cast-member.presenter';
import { SearchCastMemberDto } from './dto/search-cast-member.dto';

@Controller('cast-members')
export class CastMembersController {
  @Inject(CreateCastMemberUseCase.UseCase)
  private createUseCase: CreateCastMemberUseCase.UseCase;

  @Inject(UpdateCastMemberUseCase.UseCase)
  private updateUseCase: UpdateCastMemberUseCase.UseCase;

  @Inject(DeleteCastMemberUseCase.UseCase)
  private deleteUseCase: DeleteCastMemberUseCase.UseCase;

  @Inject(GetCastMemberUseCase.UseCase)
  private getUseCase: GetCastMemberUseCase.UseCase;

  @Inject(ListCastMemberUseCase.UseCase)
  private listUseCase: ListCastMemberUseCase.UseCase;

  @Post()
  async create(@Body() createCastMemberDto: CreateCastMemberDto) {
    const output = await this.createUseCase.execute(createCastMemberDto);
    return CastMembersController.castMemberToResponse(output);
  }

  @Get()
  async search(@Query() searchParams: SearchCastMemberDto) {
    const output = await this.listUseCase.execute(searchParams);
    return new CastMemberCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getUseCase.execute({ id });
    return CastMembersController.castMemberToResponse(output);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCastMemberDto: UpdateCastMemberDto,
  ) {
    const output = await this.updateUseCase.execute({
      id,
      ...updateCastMemberDto,
    });

    return CastMembersController.castMemberToResponse(output);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    return this.deleteUseCase.execute({ id });
  }

  static castMemberToResponse(output: CastMemberOutput) {
    return new CastMemberPresenter(output);
  }
}
