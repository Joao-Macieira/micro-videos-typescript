import { default as DefaultUseCase } from "#seedwork/application/use-case";
import { CastMemberRepository } from "../../domain";

export namespace DeleteCastMemberUseCase {
  export type Input = {
    id: string;
  }

  export class UseCase implements DefaultUseCase<Input, void> {
    constructor(private readonly castMemberRepository: CastMemberRepository.Repository) {}

    async execute(input: Input): Promise<void> {
      await this.castMemberRepository.delete(input.id);
    }
  }
}

export default DeleteCastMemberUseCase;