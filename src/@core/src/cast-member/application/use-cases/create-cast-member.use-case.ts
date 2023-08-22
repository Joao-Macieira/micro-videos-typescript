import { default as DefaultUseCase } from "#seedwork/application/use-case";
import { EntityValidationError } from "#seedwork/domain";
import { CastMember, CastMemberRepository, CastMemberType, Types } from "../../domain";
import { CastMemberOutput, CastMemberToOutputMapper } from "../dto";

export namespace CreateCastMemberUseCase {
  export type Input = {
    name: string;
    type: Types;
  }

  export type Output = CastMemberOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly castMemberRepository: CastMemberRepository.Repository) {}

    async execute(input: Input): Promise<CastMemberOutput> {
      const [type, errorCastMemberType] = CastMemberType.create(input.type);

      try {
        const entity = new CastMember({
          ...input,
          type
        });

        await this.castMemberRepository.insert(entity);
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

export default CreateCastMemberUseCase;
