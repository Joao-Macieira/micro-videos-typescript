import { default as DefaultUseCase } from "#seedwork/application/use-case";
import { EntityValidationError } from "#seedwork/domain";
import { CastMemberRepository, CastMemberType, Types } from "../../domain";
import { CastMemberOutput, CastMemberToOutputMapper } from "../dto";

export namespace UpdateCastMemberUseCase {
  export type Input = {
    id: string;
    name: string;
    type: Types;
  }

  export type Output = CastMemberOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly castMemberRepository: CastMemberRepository.Repository) {}

    async execute(input: Input): Promise<CastMemberOutput> {
      const entity = await this.castMemberRepository.findById(input.id);

      const [type, errorCastMemberType] = CastMemberType.create(input.type);

      try {
        entity.update(input.name, type);
        await this.castMemberRepository.update(entity);
        return CastMemberToOutputMapper.toOutput(entity);
      } catch (error) {
        this.handleError(error, errorCastMemberType);
      }
    }

    private handleError(error: Error, errorCastMemberType: Error | undefined) {
      if (error instanceof EntityValidationError) {
        error.setFromError("type", errorCastMemberType);
      }

      throw error;
    }
  }
}

export default UpdateCastMemberUseCase;
