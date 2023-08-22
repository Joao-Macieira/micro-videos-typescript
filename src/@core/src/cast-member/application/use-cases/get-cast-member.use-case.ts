import { default as DefaultUseCase } from "#seedwork/application/use-case";
import { CastMemberRepository } from "../../domain";
import { CastMemberOutput, CastMemberToOutputMapper } from "../dto";

export namespace GetCastMemberUseCase {
  export type Input = {
    id: string;
  }

  export type Output = CastMemberOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly castMemberRepository: CastMemberRepository.Repository) {}

    async execute(input: Input): Promise<CastMemberOutput> {
      const entity = await this.castMemberRepository.findById(input.id);
      return CastMemberToOutputMapper.toOutput(entity);
    }
  }
}

export default GetCastMemberUseCase;
